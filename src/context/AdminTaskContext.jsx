import React, { createContext, useContext, useState, useCallback } from "react";

const AdminTaskContext = createContext();
export const useAdminTasks = () => useContext(AdminTaskContext);

export const AdminTaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const startTask = useCallback(
    async (path, baseTaskId, title, serviceCall, payload) => {
      // Force a unique ID
      const uniqueId = `${baseTaskId}-${Date.now()}`;

      setTasks((prev) => [
        ...prev,
        {
          id: uniqueId,
          title,
          status: "running",
          progress: { total: 0, current: 0, name: "", success: true },
          errorMsg: null,
          logs: [],
        },
      ]);

      try {
        await serviceCall(path, payload, (rawMessage) => {
          setTasks((prev) =>
            prev.map((task) => {
              if (task.id !== uniqueId) return task;

              let newStatus = task.status;
              let newLogs = [...task.logs];
              let newProgress = { ...task.progress };
              let newErrorMsg = task.errorMsg;

              if (rawMessage === "started") {
                newLogs.unshift("Process started on server...");
              } else if (rawMessage === "done") {
                newStatus = "completed";
                newLogs.unshift("Process finished successfully.");
              } else {
                try {
                  const data = JSON.parse(rawMessage);

                  if (data.error) {
                    newStatus = "error";
                    newErrorMsg = data.error;
                    newLogs.unshift(`[Error]: ${data.error}`);
                  } else if (data.total !== undefined) {
                    // Handles Progress struct
                    newProgress = {
                      total: data.total,
                      current: data.current,
                      name: data.name,
                      success: data.success,
                    };
                    const statusMark = data.success ? "✓" : "✗";
                    newLogs.unshift(
                      `[${data.current}/${data.total}] Processed: ${data.name} ${statusMark}`,
                    );
                  }
                } catch (e) {
                  newLogs.unshift(rawMessage);
                }
              }

              return {
                ...task,
                status: newStatus,
                progress: newProgress,
                errorMsg: newErrorMsg,
                logs: newLogs.slice(0, 50),
              };
            }),
          );
        });
      } catch (error) {
        console.error("Task execution failed:", error);
        setTasks((prev) =>
          prev.map((task) =>
            task.id === uniqueId
              ? { ...task, status: "error", errorMsg: error.message }
              : task,
          ),
        );
      }
    },
    [],
  );

  const dismissTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return (
    <AdminTaskContext.Provider value={{ tasks, startTask, dismissTask }}>
      {children}
    </AdminTaskContext.Provider>
  );
};
