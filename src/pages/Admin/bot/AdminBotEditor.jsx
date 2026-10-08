import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  SelectionMode,
} from "reactflow";
import "reactflow/dist/style.css";

// Bootstrap Components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

// Hooks & Sub-components
import {
  useBotGraph,
  useUpdateBotGraph,
  useResetBot,
} from "../../../features/bot/hooks/useBot";
import BotHeader from "./components/BotHeader";
import NodeLibrary from "./components/NodeLibrary";
import PropertiesEditor from "./components/PropertiesEditor";
import CustomMessageNode from "./components/CustomMessageNode";
import CustomInputNode from "./components/CostomInputNode";
import CustomActionNode from "./components/CustomActionNode";

// Register custom node types
const nodeTypes = {
  message: CustomMessageNode,
  input: CustomInputNode,
  action: CustomActionNode,
};

const AdminBotEditor = () => {
  const {
    data: graphData,
    isLoading,
    isError,
    error: fetchError,
  } = useBotGraph();
  const updateMutation = useUpdateBotGraph();
  const resetMutation = useResetBot();

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);

  // History State for Undo/Redo
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  const takeSnapshot = useCallback(() => {
    setPast((prev) => [...prev.slice(-29), { nodes, edges }]); // Keep last 30 steps
    setFuture([]);
  }, [nodes, edges]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setFuture((prev) => [{ nodes, edges }, ...prev]);
    setNodes(previous.nodes);
    setEdges(previous.edges);
    setPast((prev) => prev.slice(0, -1));
  }, [past, nodes, edges]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setPast((prev) => [...prev, { nodes, edges }]);
    setNodes(next.nodes);
    setEdges(next.edges);
    setFuture((prev) => prev.slice(1));
  }, [future, nodes, edges]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  useEffect(() => {
    if (graphData) {
      // Map pos_x/y to React Flow x/y
      const initialNodes = graphData.nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: { x: n.position.pos_x, y: n.position.pos_y },
        data: n.data,
        draggable: !n.data.is_locked,
      }));
      setNodes(initialNodes);
      setEdges(graphData.edges || []);
    }
  }, [graphData]);

  // Handle success messages after saving or resetting
  useEffect(() => {
    if (updateMutation.isSuccess || resetMutation.isSuccess) {
      setSuccessMessage(
        updateMutation.isSuccess
          ? "Bot graph saved successfully!"
          : "Bot reset to default state successfully!",
      );
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [updateMutation.isSuccess, resetMutation.isSuccess]);

  // React Flow Interaction Handlers
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  const onConnect = useCallback(
    (params) => {
      takeSnapshot();
      // Create a basic edge
      const newEdge = {
        ...params,
        id: `e${params.source}-${params.target}`,
        keyword: "new_option",
        data: { translations: { ar: "خيار جديد", en: "New Option" } },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [takeSnapshot],
  );

  const onNodeClick = useCallback((_, node) => {
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null);
  }, []);
  const onEdgeClick = useCallback((_, edge) => {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
  }, []);
  const onPaneClick = () => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  };

  // Update individual node data
  const handleUpdateNode = (id, updatedData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: updatedData } : node,
      ),
    );
  };

  const handleUpdateEdge = (id, updatedEdge) => {
    setEdges((eds) =>
      eds.map((edge) => (edge.id === id ? { ...edge, ...updatedEdge } : edge)),
    );
  };

  // Add new node via NodeLibrary
  const handleAddNode = (type) => {
    takeSnapshot();
    const newNode = {
      id: `${type}_${Date.now()}`,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        translations: { ar: "", en: "" },
        is_start: false,
        is_locked: false,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleDeleteNode = useCallback(
    (id) => {
      takeSnapshot();
      if (window.confirm("Are you sure you want to delete this node?")) {
        setNodes((nds) => nds.filter((node) => node.id !== id));
        // remove edges connected to this node
        setEdges((eds) =>
          eds.filter((edge) => edge.source !== id && edge.target !== id),
        );
        setSelectedNodeId(null);
      }
    },
    [takeSnapshot],
  );

  const handleDeleteEdge = useCallback(
    (id) => {
      takeSnapshot();
      if (window.confirm("Are you sure you want to delete this edge?")) {
        setEdges((eds) => eds.filter((edge) => edge.id !== id));
        setSelectedEdgeId(null);
      }
    },
    [takeSnapshot],
  );

  // Map back to Go pos_x/y format
  const handleSave = () => {
    const payload = {
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: {
          pos_x: Math.round(n.position.x),
          pos_y: Math.round(n.position.y),
        },
        data: n.data,
      })),
      edges: edges,
    };
    updateMutation.mutate(payload);
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the entire bot? This will permanently delete all custom nodes and edges and revert to the default state.",
      )
    ) {
      resetMutation.mutate(null, {
        onSuccess: () => {
          setSelectedNodeId(null);
          setSelectedEdgeId(null);
        },
      });
    }
  };

  // Derived state for the sidebar
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedEdge = edges.find((e) => e.id === selectedEdgeId);

  if (isLoading)
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );

  return (
    <div
      className="bot-editor-wrapper d-flex flex-column"
      style={{ height: "calc(100vh - 120px)" }}
    >
      <BotHeader
        isPending={updateMutation.isPending}
        isResetting={resetMutation.isPending}
        onReset={handleReset}
        onSave={handleSave}
      />

      {/* Success Message */}
      {successMessage && (
        <Alert
          variant="success"
          className="mx-3 py-2 small"
          onClose={() => setSuccessMessage(null)}
          dismissible
        >
          {successMessage}
        </Alert>
      )}

      {/* Mutation Errors */}
      {(updateMutation.isError || resetMutation.isError) && (
        <Alert
          variant="danger"
          className="mx-3 py-2 small"
          onClose={() => {
            updateMutation.reset();
            resetMutation.reset();
          }}
          dismissible
        >
          {updateMutation.error?.errors || resetMutation.error?.errors ? (
            <ul className="mb-0">
              {Object.entries(
                updateMutation.error?.errors || resetMutation.error?.errors,
              ).map(([key, msg]) => (
                <li key={key}>
                  <strong>{key}:</strong> {msg}
                </li>
              ))}
            </ul>
          ) : (
            // Fallback for general error messages
            updateMutation.error?.message ||
            resetMutation.error?.message ||
            "An unknown error occurred."
          )}
        </Alert>
      )}

      <Row className="flex-grow-1 g-0 border rounded overflow-hidden bg-white">
        {/* Visual Canvas Area */}
        <Col md={9} className="position-relative border-end">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            snapToGrid
            snapGrid={[10, 10]}
            selectionOnDrag
            selectionMode={SelectionMode.Partial}
            panOnDrag={[1, 2]} // Pan with right or middle mouse button
            onNodeDragStart={takeSnapshot}
            onSelectionDragStart={takeSnapshot}
            // style={{ background: "#f8f9fa" }}

            defaultEdgeOptions={{
              style: { strokeWidth: 3 },
              type: "smoothstep",
            }}
            fitView
          >
            <Background color="#e6e6e6" gap={10} variant="lines" />
            <Controls />
          </ReactFlow>
        </Col>

        {/* Right Controls & Properties Panel */}
        <Col
          md={3}
          className="d-flex flex-column bg-light shadow-sm overflow-hidden"
        >
          <div className="flex-shrink-0">
            <NodeLibrary onAddNode={handleAddNode} />
          </div>
          <div className="flex-grow-1 position-relative">
            <div className="position-absolute top-0 start-0 end-0 bottom-0">
              <PropertiesEditor
                selectedNode={selectedNode}
                selectedEdge={selectedEdge}
                onUpdateNode={handleUpdateNode}
                onUpdateEdge={handleUpdateEdge}
                onDeleteNode={handleDeleteNode}
                onDeleteEdge={handleDeleteEdge}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AdminBotEditor;
