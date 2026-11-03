import { useEffect, useMemo, useState } from "react";

import "./digit-recognizer.css";

/**
 * Displays a button that calls the backend and shows the returned message.
 * @returns {JSX.Element} Backend call panel.
 */
function DigitRecognizerPanel({ onBack }) {
  const gridSize = 28;
  const [pixels, setPixels] = useState(() => Array(gridSize * gridSize).fill(0));
  const [prediction, setPrediction] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const backendBaseUrl = import.meta.env.DEV
    ? "http://localhost:3000"
    : "https://backend-production-rossello.up.railway.app";
  const hasDrawing = useMemo(() => pixels.some((pixel) => pixel > 0), [pixels]);

  useEffect(() => {
    const stopDrawing = () => {
      setIsDrawing(false);
    };

    window.addEventListener("pointerup", stopDrawing);
    window.addEventListener("pointercancel", stopDrawing);
    window.addEventListener("blur", stopDrawing);

    return () => {
      window.removeEventListener("pointerup", stopDrawing);
      window.removeEventListener("pointercancel", stopDrawing);
      window.removeEventListener("blur", stopDrawing);
    };
  }, []);

  const paintPixel = (index) => {
    setPixels((previous) => {
      if (previous[index] === 1) {
        return previous;
      }

      const updated = [...previous];
      updated[index] = 1;
      return updated;
    });
  };

  const buildModelInput = () =>
    Array.from({ length: gridSize }, (_, row) => pixels.slice(row * gridSize, (row + 1) * gridSize));

  /**
    * Sends a request to the backend and updates UI state.
    * @returns {Promise<void>} Promise resolved after response handling.
   */
  const handlePredict = async () => {
    if (!hasDrawing) {
      setPrediction(null);
      setStatusMessage("Draw a digit first, then click Predict digit.");
      return;
    }

    try {
      setIsLoading(true);
      setStatusMessage("");
      const result = await fetch(`${backendBaseUrl}/api/predict-digit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ grid: buildModelInput() }),
      });

      if (!result.ok) {
        throw new Error("Request failed");
      }

      const data = await result.json();
      setPrediction({
        digit: data.digit,
        confidence: data.confidence,
      });
    } catch {
      setPrediction(null);
      setStatusMessage("Prediction failed. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPixels(Array(gridSize * gridSize).fill(0));
    setPrediction(null);
    setStatusMessage("");
  };

  const handlePointerDown = (event, index) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    setIsDrawing(true);
    paintPixel(index);
  };

  const handlePointerEnter = (event, index) => {
    if (!isDrawing) {
      return;
    }

    if ((event.buttons & 1) !== 1) {
      setIsDrawing(false);
      return;
    }

    paintPixel(index);
  };

  return (
    <section className="project-panel backend-project-panel" aria-label="The Famous Digit AI">
      <header className="dino-simple-header">
        <h1 className="content-title dino-content-title">The Famous Digit AI</h1>
      </header>
      <div className="project-detail-toolbar">
        <button className="button button-secondary" type="button" onClick={onBack}>← Go back</button>
      </div>

      <section className="project-intro dino-story" aria-label="Digit recognizer overview">
        <p className="project-body-text dino-story-paragraph">
          This small demo lets you sketch a handwritten digit and send it to the backend image model for a quick prediction.
          It is a simple way to show the full loop: a frontend drawing surface, a backend API call, and an AI result coming back live.
        </p>
        <p className="project-body-text dino-story-paragraph">
          Draw directly in the grid below, click <strong>Predict digit</strong>, and the model will return both its best guess
          and a confidence score.
        </p>
      </section>

      <section className="project-content backend-project-content dino-skill-content" aria-label="Digit recognizer workspace">
        <div className="backend-call">
          <h2 className="backend-demo-title">Draw a digit</h2>
          <p className="backend-demo-subtitle">Click and drag inside the grid, then ask the backend model to predict it.</p>

          <div className="backend-workspace">
            <div
              className="digit-grid"
              role="grid"
              aria-label="Digit drawing grid"
              style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
              onPointerUp={() => setIsDrawing(false)}
              onPointerLeave={() => setIsDrawing(false)}
            >
              {pixels.map((pixel, index) => (
                <button
                  key={index}
                  type="button"
                  role="gridcell"
                  draggable="false"
                  className={`digit-cell ${pixel ? "is-active" : ""}`}
                  aria-label={`Cell ${index + 1}`}
                  aria-pressed={pixel === 1}
                  onDragStart={(event) => event.preventDefault()}
                  onPointerDown={(event) => handlePointerDown(event, index)}
                  onPointerEnter={(event) => handlePointerEnter(event, index)}
                />
              ))}
            </div>

            <div className="backend-side-panel">
              <div className="backend-actions">
                <button className="button" onClick={handlePredict} type="button" disabled={isLoading} aria-busy={isLoading}>
                  {isLoading ? "Predicting..." : "Predict digit"}
                </button>
                <button className="button button-secondary" onClick={handleClear} type="button" disabled={isLoading}>
                  Clear
                </button>
              </div>

              {prediction && (
                <div className="prediction-card" role="status" aria-live="polite">
                  <p className="prediction-card-label">Prediction</p>
                  <p className="prediction-card-digit">{prediction.digit}</p>
                  <p className="prediction-card-confidence">Confidence: {Math.round(prediction.confidence * 100)}%</p>
                </div>
              )}

              {statusMessage && (
                <p className="backend-response" role="status" aria-live="polite">
                  {statusMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="project-content backend-architecture-panel dino-skill-content" aria-label="Digit recognizer architecture">
        <div className="backend-architecture-header">
          <p className="dino-eyebrow backend-architecture-eyebrow">Architecture</p>
          <h2 className="backend-architecture-title">How this demo is wired</h2>
          <p className="backend-architecture-copy">
            The frontend sends the drawing to the Railway backend, which runs the ONNX model and returns a prediction.
          </p>
        </div>

        <div className="backend-architecture-diagram" role="img" aria-label="Frontend sends the digit grid to the Railway backend, which runs the ONNX model and returns a prediction to the frontend.">
          <article className="backend-architecture-node">
            <p className="backend-architecture-node-kicker">Frontend</p>
            <h3 className="backend-architecture-node-title">React drawing grid</h3>
            <p className="backend-architecture-node-copy">
              Captures the sketch directly on a <strong>28 x 28</strong> grid, then sends it to the API.
            </p>
          </article>

          <div className="backend-architecture-link backend-architecture-link-request" aria-hidden="true">
            <span className="backend-architecture-link-line" />
            <span className="backend-architecture-link-label">POST /api/predict-digit</span>
          </div>

          <article className="backend-architecture-node backend-architecture-node-core">
            <p className="backend-architecture-node-kicker">Backend on Railway</p>
            <h3 className="backend-architecture-node-title">Express + ONNX Runtime</h3>
            <p className="backend-architecture-node-copy">
              Validates the payload, runs inference on the MNIST model, then returns the predicted digit and confidence.
            </p>
          </article>
        </div>
      </section>
    </section>
  );
}

export default DigitRecognizerPanel;