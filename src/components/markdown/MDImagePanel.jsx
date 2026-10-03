import "./MDImagePanel.css";

const IconClose = () => (
  <img
    src={new URL("./../assets/close-x.svg", import.meta.url).href}
    alt="Bold"
    className="md-icon"
  />
);

// Constant used to disable image upload on purpose, as there are still
// Changes that need to happen on the gallery APIs
const isReady = false;

export function MDImagePanel({
  isOpen,
  onClose,
  imgUrl,
  setImgUrl,
  imgAlt,
  setImgAlt,
  imgWidth,
  setImgWidth,
  imgAlign,
  setImgAlign,
  uploadedFile,
  setUploadedFile,
  onInsert,
  isUploading,
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className="md-image-overlay" onClick={onClose}></div>

      <div className="md-image-modal">
        <div className="md-image-panel-header">
          <h4>Insert Image</h4>
          <button className="md-close-btn" onClick={onClose}>
            <IconClose />
          </button>
        </div>

        <div className="md-image-panel-content">
          {isReady ? (
            <>
              <div className="md-image-panel-section">
                <h5>Upload from Device</h5>
                <div className="md-file-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setUploadedFile(file);
                    }}
                    disabled={isUploading}
                    id="md-file-input"
                  />
                  <label htmlFor="md-file-input" className="md-file-label">
                    {uploadedFile?.name ||
                      (isUploading ? "Uploading..." : "Choose image...")}
                  </label>
                </div>
              </div>

              <div className="md-image-panel-divider">OR</div>
            </>
          ) : (
            <></>
          )}

          <div className="md-image-panel-section">
            <h5>Use Image URL</h5>
            <input
              placeholder="https://example.com/image.jpg"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              disabled={uploadedFile || isUploading}
            />
          </div>

          <div className="md-image-panel-section">
            <h5>Image Options</h5>
            <input
              placeholder="Alt text (description of image)"
              value={imgAlt}
              onChange={(e) => setImgAlt(e.target.value)}
            />
            <input
              placeholder="Width (e.g. 300px or 50%)"
              value={imgWidth}
              onChange={(e) => setImgWidth(e.target.value)}
            />
            <select
              value={imgAlign}
              onChange={(e) => setImgAlign(e.target.value)}
            >
              <option value="left">Align: Left</option>
              <option value="center">Align: Center</option>
              <option value="right">Align: Right</option>
            </select>
          </div>

          <div className="md-image-panel-actions">
            <button
              className="md-btn primary"
              onClick={onInsert}
              disabled={(!uploadedFile && !imgUrl) || isUploading}
            >
              {isUploading ? "Uploading..." : "Insert Image"}
            </button>
            <button
              className="md-btn secondary"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
