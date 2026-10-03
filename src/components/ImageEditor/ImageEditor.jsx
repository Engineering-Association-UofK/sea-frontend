/* eslint-disable react-hooks/refs */
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Container, Toast, ToastContainer } from "react-bootstrap";
import { uploadService } from "../../api/upload.service";
import "./ImageEditor.css";

const HANDLE_SIZE = 10;

const ImageEditor = ({ setUrl }) => {
  // ---- State ----
  const [imageSrc, setImageSrc] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [originalImgData, setOriginalImgData] = useState(null); // for Reset
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [exportFormat, setExportFormat] = useState("original");
  const [dragging, setDragging] = useState(false);

  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "primary",
  });
  const showToast = (message, variant = "primary") => {
    setToast({ show: true, message, variant });
  };

  // Crop state
  const [cropMode, setCropMode] = useState(false);
  const [cropRect, setCropRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [dragType, setDragType] = useState(null); // 'move' | 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
  const [dragOrigin, setDragOrigin] = useState({ mx: 0, my: 0, rect: null });

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  // ---- Load image onto canvas ----
  const drawImage = useCallback(() => {
    if (!imgRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = imgRef.current;

    const isRotated = rotation % 180 !== 0;
    const cw = isRotated ? height : width;
    const ch = isRotated ? width : height;

    canvas.width = cw;
    canvas.height = ch;

    ctx.clearRect(0, 0, cw, ch);
    ctx.save();
    ctx.translate(cw / 2, ch / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.restore();
  }, [width, height, rotation, flipH, flipV]);

  useEffect(() => {
    drawImage();
  }, [drawImage]);

  // ---- Handle file load ----
  const loadFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setOriginalFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setOriginalImgData(e.target.result); // store for Reset
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
        setAspectRatio(img.naturalWidth / img.naturalHeight);
        setRotation(0);
        setFlipH(false);
        setFlipV(false);
        setCropMode(false);
        setImageSrc(e.target.result);
        showToast("Image uploaded successfully", "success");
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    loadFile(e.target.files[0]);
  };

  // ---- Drag & Drop ----
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    loadFile(e.dataTransfer.files[0]);
  };

  // ---- Resize ----
  const handleWidthChange = (val) => {
    const w = Math.max(1, parseInt(val) || 0);
    setWidth(w);
    if (lockAspect && aspectRatio) {
      setHeight(Math.round(w / aspectRatio));
    }
  };

  const handleHeightChange = (val) => {
    const h = Math.max(1, parseInt(val) || 0);
    setHeight(h);
    if (lockAspect && aspectRatio) {
      setWidth(Math.round(h * aspectRatio));
    }
  };

  // ---- Rotate ----
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
    showToast("Image rotated by 90°", "primary");
  };

  // ---- Flip ----
  const handleFlipH = () => {
    setFlipH((prev) => !prev);
    showToast("Image flipped horizontally", "primary");
  };
  const handleFlipV = () => {
    setFlipV((prev) => !prev);
    showToast("Image flipped vertically", "primary");
  };

  // ---- Reset to original ----
  const handleResetToOriginal = () => {
    if (!originalImgData) return;
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
      setAspectRatio(img.naturalWidth / img.naturalHeight);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setCropMode(false);
      setImageSrc(originalImgData);
      showToast("Image reset to original", "secondary");
    };
    img.src = originalImgData;
  };

  // ---- Crop logic (resizable default rectangle) ----
  const getDisplayScale = () => {
    const canvas = canvasRef.current;
    if (!canvas) return { sx: 1, sy: 1 };
    const rect = canvas.getBoundingClientRect();
    return { sx: rect.width / canvas.width, sy: rect.height / canvas.height };
  };

  const startCropMode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Default crop rectangle: 80% centered
    const margin = 0.1;
    setCropRect({
      x: Math.round(canvas.width * margin),
      y: Math.round(canvas.height * margin),
      w: Math.round(canvas.width * (1 - 2 * margin)),
      h: Math.round(canvas.height * (1 - 2 * margin)),
    });
    setCropMode(true);
  };

  const cancelCrop = () => {
    setCropMode(false);
    setDragType(null);
  };

  const applyCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { x, y, w, h } = cropRect;
    if (w < 2 || h < 2) return;

    const imageData = ctx.getImageData(x, y, w, h);
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = w;
    tempCanvas.height = h;
    tempCanvas.getContext("2d").putImageData(imageData, 0, 0);

    const croppedImg = new Image();
    croppedImg.onload = () => {
      imgRef.current = croppedImg;
      setWidth(Math.round(w));
      setHeight(Math.round(h));
      setAspectRatio(w / h);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setCropMode(false);
      showToast("Image cropped successfully", "success");
    };
    croppedImg.src = tempCanvas.toDataURL();
  };

  // ---- Crop handle interaction ----
  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const { sx, sy } = getDisplayScale();
    return {
      x: (e.clientX - rect.left) / sx,
      y: (e.clientY - rect.top) / sy,
    };
  };

  const hitTestHandle = (mx, my) => {
    const { x, y, w, h } = cropRect;
    const { sx } = getDisplayScale();
    const hs = HANDLE_SIZE / sx; // handle size in canvas coords
    const handles = [
      { id: "nw", cx: x, cy: y },
      { id: "n", cx: x + w / 2, cy: y },
      { id: "ne", cx: x + w, cy: y },
      { id: "e", cx: x + w, cy: y + h / 2 },
      { id: "se", cx: x + w, cy: y + h },
      { id: "s", cx: x + w / 2, cy: y + h },
      { id: "sw", cx: x, cy: y + h },
      { id: "w", cx: x, cy: y + h / 2 },
    ];
    for (const handle of handles) {
      if (Math.abs(mx - handle.cx) <= hs && Math.abs(my - handle.cy) <= hs) {
        return handle.id;
      }
    }
    // Check if inside rect for move
    if (mx >= x && mx <= x + w && my >= y && my <= y + h) {
      return "move";
    }
    return null;
  };

  const handleCropMouseDown = (e) => {
    if (!cropMode) return;
    e.preventDefault();
    const pos = getMousePos(e);
    const hit = hitTestHandle(pos.x, pos.y);
    if (!hit) return;
    setDragType(hit);
    setDragOrigin({ mx: pos.x, my: pos.y, rect: { ...cropRect } });
  };

  const handleCropMouseMove = (e) => {
    if (!dragType) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pos = getMousePos(e);
    const dx = pos.x - dragOrigin.mx;
    const dy = pos.y - dragOrigin.my;
    const orig = dragOrigin.rect;

    let { x, y, w, h } = orig;
    const minSize = 10;

    if (dragType === "move") {
      x = Math.max(0, Math.min(canvas.width - w, orig.x + dx));
      y = Math.max(0, Math.min(canvas.height - h, orig.y + dy));
    } else {
      // Handle resizing
      if (dragType.includes("w")) {
        const newX = Math.max(
          0,
          Math.min(orig.x + orig.w - minSize, orig.x + dx),
        );
        w = orig.w + (orig.x - newX);
        x = newX;
      }
      if (dragType.includes("e")) {
        w = Math.max(minSize, Math.min(canvas.width - orig.x, orig.w + dx));
      }
      if (dragType.includes("n")) {
        const newY = Math.max(
          0,
          Math.min(orig.y + orig.h - minSize, orig.y + dy),
        );
        h = orig.h + (orig.y - newY);
        y = newY;
      }
      if (dragType.includes("s")) {
        h = Math.max(minSize, Math.min(canvas.height - orig.y, orig.h + dy));
      }
    }

    setCropRect({
      x: Math.round(x),
      y: Math.round(y),
      w: Math.round(w),
      h: Math.round(h),
    });
  };

  const handleCropMouseUp = () => {
    setDragType(null);
  };

  // ---- Crop overlay CSS (rendered as a div over the canvas) ----
  const getCropOverlayStyle = () => {
    if (!cropMode || !canvasRef.current) return {};
    const { sx, sy } = getDisplayScale();
    return {
      left: `${cropRect.x * sx}px`,
      top: `${cropRect.y * sy}px`,
      width: `${cropRect.w * sx}px`,
      height: `${cropRect.h * sy}px`,
    };
  };

  const getHandlePositions = () => {
    if (!cropMode || !canvasRef.current) return [];
    const { sx, sy } = getDisplayScale();
    const { x, y, w, h } = cropRect;
    const hs = HANDLE_SIZE;
    return [
      {
        id: "nw",
        style: {
          left: x * sx - hs / 2,
          top: y * sy - hs / 2,
          cursor: "nw-resize",
        },
      },
      {
        id: "n",
        style: {
          left: (x + w / 2) * sx - hs / 2,
          top: y * sy - hs / 2,
          cursor: "n-resize",
        },
      },
      {
        id: "ne",
        style: {
          left: (x + w) * sx - hs / 2,
          top: y * sy - hs / 2,
          cursor: "ne-resize",
        },
      },
      {
        id: "e",
        style: {
          left: (x + w) * sx - hs / 2,
          top: (y + h / 2) * sy - hs / 2,
          cursor: "e-resize",
        },
      },
      {
        id: "se",
        style: {
          left: (x + w) * sx - hs / 2,
          top: (y + h) * sy - hs / 2,
          cursor: "se-resize",
        },
      },
      {
        id: "s",
        style: {
          left: (x + w / 2) * sx - hs / 2,
          top: (y + h) * sy - hs / 2,
          cursor: "s-resize",
        },
      },
      {
        id: "sw",
        style: {
          left: x * sx - hs / 2,
          top: (y + h) * sy - hs / 2,
          cursor: "sw-resize",
        },
      },
      {
        id: "w",
        style: {
          left: x * sx - hs / 2,
          top: (y + h / 2) * sy - hs / 2,
          cursor: "w-resize",
        },
      },
    ];
  };

  // ---- Export / Download ----
  const getExportMime = () => {
    if (exportFormat === "png") return "image/png";
    if (exportFormat === "jpg") return "image/jpeg";
    if (originalFile) {
      if (originalFile.type === "image/jpeg") return "image/jpeg";
      if (originalFile.type === "image/png") return "image/png";
      if (originalFile.type === "image/webp") return "image/webp";
    }
    return "image/png";
  };

  const getExportExtension = () => {
    const mime = getExportMime();
    if (mime === "image/jpeg") return "jpg";
    if (mime === "image/png") return "png";
    if (mime === "image/webp") return "webp";
    return "png";
  };

  // const handleExport = () => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;
  //   const mime = getExportMime();
  //   const dataUrl = canvas.toDataURL(mime, 0.92);
  //   const link = document.createElement('a');
  //   const baseName = originalFile ? originalFile.name.replace(/\.[^.]+$/, '') : 'edited-image';
  //   link.download = `${baseName}.${getExportExtension()}`;
  //   link.href = dataUrl;
  //   link.click();
  //   showToast(`Image downloaded as ${getExportExtension().toUpperCase()}`, 'success');
  // };

  const handleUpload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mime = getExportMime();

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;

        const baseName = originalFile
          ? originalFile.name.replace(/\.[^.]+$/, "")
          : "edited-image";

        const file = new File([blob], `${baseName}.${getExportExtension()}`, {
          type: mime,
        });

        try {
          const result = await uploadService.uploadImage(file);
          showToast("Image uploaded successfully", "success");

          setUrl(result);
        } catch (err) {
          showToast("Upload failed", "error", err.message);
        }
      },
      mime,
      0.92,
    );
  };

  // ---- Remove image entirely ----
  const handleRemove = () => {
    setImageSrc(null);
    setOriginalFile(null);
    setOriginalImgData(null);
    setWidth(0);
    setHeight(0);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setCropMode(false);
    setExportFormat("original");
    imgRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = "";
    showToast("Image removed", "danger");
  };

  // ---- Render ----
  return (
    <div className="image-editor">
      <ToastContainer
        position="top-end"
        className="p-3 mt-5"
        style={{ position: "fixed", zIndex: 1050 }}
      >
        <Toast
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          delay={3000}
          autohide
          bg={toast.variant}
        >
          <Toast.Body
            className={
              toast.variant !== "light" && toast.variant !== "warning"
                ? "text-white"
                : ""
            }
          >
            <div className="d-flex justify-content-between align-items-center">
              <span>{toast.message}</span>
              <button
                type="button"
                className={`btn-close ${toast.variant !== "light" && toast.variant !== "warning" ? "btn-close-white" : ""} btn-sm`}
                onClick={() => setToast({ ...toast, show: false })}
              ></button>
            </div>
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Container>
        <h1 className="ie-title">
          <i className="bi bi-pencil-square me-2"></i>Image Editor
        </h1>
        <p className="ie-subtitle">
          Upload, crop, resize, rotate, flip, and export your images
        </p>

        {!imageSrc ? (
          <div
            className={`ie-dropzone ${dragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <i className="bi bi-cloud-arrow-up ie-dropzone-icon"></i>
            <p className="ie-dropzone-text mb-0">
              Drag & drop an image here, or <strong>browse</strong>
            </p>
            <span className="ie-dropzone-text" style={{ fontSize: "0.8rem" }}>
              Supports JPG, PNG, WEBP
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              style={{ display: "none" }}
            />
          </div>
        ) : (
          <div className="ie-wrapper">
            {/* Toolbar */}
            <div className="ie-toolbar">
              {/* Crop */}
              <div className="ie-section">
                <div className="ie-section-title">Crop</div>
                {cropMode ? (
                  <>
                    <p className="ie-crop-hint">
                      <i className="bi bi-crop me-1"></i>Drag corners or edges
                      to resize
                    </p>
                    <div className="ie-btn-group">
                      <button
                        className="ie-btn ie-btn-primary ie-btn-sm"
                        onClick={applyCrop}
                      >
                        <i className="bi bi-check-lg"></i> Apply
                      </button>
                      <button
                        className="ie-btn ie-btn-outline ie-btn-sm"
                        onClick={cancelCrop}
                      >
                        <i className="bi bi-x-lg"></i> Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    className="ie-btn ie-btn-outline ie-btn-block"
                    onClick={startCropMode}
                  >
                    <i className="bi bi-crop"></i> Free Crop
                  </button>
                )}
              </div>

              {/* Resize */}
              <div className="ie-section">
                <div className="ie-section-title">Resize</div>
                <div className="ie-input-group">
                  <div className="ie-input-row">
                    <label>Width</label>
                    <input
                      className="ie-input"
                      type="number"
                      min="1"
                      value={width}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      onBlur={() => showToast("Image width updated", "primary")}
                    />
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--ie-text-muted)",
                      }}
                    >
                      px
                    </span>
                  </div>
                  <div className="ie-input-row">
                    <label>Height</label>
                    <input
                      className="ie-input"
                      type="number"
                      min="1"
                      value={height}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      onBlur={() =>
                        showToast("Image height updated", "primary")
                      }
                    />
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--ie-text-muted)",
                      }}
                    >
                      px
                    </span>
                  </div>
                  <label className="ie-checkbox-row">
                    <input
                      type="checkbox"
                      checked={lockAspect}
                      onChange={(e) => setLockAspect(e.target.checked)}
                    />
                    <i
                      className={`bi ${lockAspect ? "bi-lock-fill" : "bi-unlock"}`}
                    ></i>
                    Lock aspect ratio
                  </label>
                </div>
              </div>

              {/* Rotate & Flip */}
              <div className="ie-section">
                <div className="ie-section-title">Transform</div>
                <div
                  className="ie-btn-group"
                  style={{ marginBottom: "0.5rem" }}
                >
                  <button
                    className="ie-btn ie-btn-outline ie-btn-sm"
                    onClick={handleRotate}
                  >
                    <i className="bi bi-arrow-clockwise"></i> Rotate 90°
                  </button>
                </div>
                <div className="ie-btn-group">
                  <button
                    className="ie-btn ie-btn-outline ie-btn-sm"
                    onClick={handleFlipH}
                  >
                    <i className="bi bi-symmetry-vertical"></i> Flip H
                  </button>
                  <button
                    className="ie-btn ie-btn-outline ie-btn-sm"
                    onClick={handleFlipV}
                  >
                    <i className="bi bi-symmetry-horizontal"></i> Flip V
                  </button>
                </div>
              </div>

              {/* Export Format */}
              <div className="ie-section">
                <div className="ie-section-title">Save As</div>
                <div className="ie-radio-group">
                  {["original", "png", "jpg"].map((fmt) => (
                    <label
                      key={fmt}
                      className={`ie-radio-label ${exportFormat === fmt ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="exportFormat"
                        value={fmt}
                        checked={exportFormat === fmt}
                        onChange={() => setExportFormat(fmt)}
                      />
                      {fmt === "original" ? "Original" : fmt.toUpperCase()}
                    </label>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <button
                  className="ie-btn ie-btn-primary ie-btn-block"
                  onClick={handleUpload}
                >
                  <i className="bi bi-download"></i> Confirm changes & Upload
                </button>
                {/* <button className="ie-btn ie-btn-primary ie-btn-block" onClick={handleExport}>
                  <i className="bi bi-download"></i> Export & Download
                </button> */}
                <button
                  className="ie-btn ie-btn-outline ie-btn-block ie-btn-sm"
                  onClick={handleResetToOriginal}
                >
                  <i className="bi bi-arrow-counterclockwise"></i> Reset to
                  Original
                </button>
                <button
                  className="ie-btn ie-btn-danger ie-btn-block ie-btn-sm"
                  onClick={handleRemove}
                >
                  <i className="bi bi-trash"></i> Remove Image
                </button>
              </div>
            </div>

            {/* Canvas area */}
            <div className="ie-canvas-area">
              <div
                className={`ie-canvas-container ${cropMode ? "crop-active" : ""}`}
                ref={containerRef}
                onMouseDown={handleCropMouseDown}
                onMouseMove={handleCropMouseMove}
                onMouseUp={handleCropMouseUp}
                onMouseLeave={handleCropMouseUp}
              >
                <canvas ref={canvasRef} />
                {/* Darkened overlay outside crop area */}
                {cropMode && (
                  <div className="ie-crop-dimmer">
                    {/* Top */}
                    <div
                      className="ie-crop-dim-region"
                      style={{
                        top: 0,
                        left: 0,
                        right: 0,
                        height: `${cropRect.y * getDisplayScale().sy}px`,
                      }}
                    />
                    {/* Bottom */}
                    <div
                      className="ie-crop-dim-region"
                      style={{
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: `${(canvasRef.current.height - cropRect.y - cropRect.h) * getDisplayScale().sy}px`,
                      }}
                    />
                    {/* Left */}
                    <div
                      className="ie-crop-dim-region"
                      style={{
                        top: `${cropRect.y * getDisplayScale().sy}px`,
                        left: 0,
                        width: `${cropRect.x * getDisplayScale().sx}px`,
                        height: `${cropRect.h * getDisplayScale().sy}px`,
                      }}
                    />
                    {/* Right */}
                    <div
                      className="ie-crop-dim-region"
                      style={{
                        top: `${cropRect.y * getDisplayScale().sy}px`,
                        right: 0,
                        width: `${(canvasRef.current.width - cropRect.x - cropRect.w) * getDisplayScale().sx}px`,
                        height: `${cropRect.h * getDisplayScale().sy}px`,
                      }}
                    />
                  </div>
                )}
                {/* Crop border */}
                {cropMode && (
                  <div className="ie-crop-border" style={getCropOverlayStyle()}>
                    <div className="ie-crop-border-inner"></div>
                  </div>
                )}
                {/* Crop handles */}
                {cropMode &&
                  getHandlePositions().map((h) => (
                    <div
                      key={h.id}
                      className="ie-crop-handle"
                      style={{
                        left: `${h.style.left}px`,
                        top: `${h.style.top}px`,
                        cursor: h.style.cursor,
                        width: `${HANDLE_SIZE}px`,
                        height: `${HANDLE_SIZE}px`,
                      }}
                    />
                  ))}
              </div>
              <div className="ie-info-bar">
                <span className="ie-info-badge">
                  {width} × {height} px
                </span>
                <span className="ie-info-badge">{rotation}°</span>
                {flipH && <span className="ie-info-badge">Flipped H</span>}
                {flipV && <span className="ie-info-badge">Flipped V</span>}
                {originalFile && (
                  <span style={{ color: "var(--ie-text-muted)" }}>
                    {originalFile.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default ImageEditor;
