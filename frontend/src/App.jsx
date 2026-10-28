import { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("College Students");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [newsletter, setNewsletter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function generateNewsletter(event) {
    event.preventDefault();

    console.log("Generate Newsletter button clicked!");

    if (!topic.trim()) {
      setError("Please enter a newsletter topic.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setNewsletter("");

    try {
      console.log("Sending request to:", `${API_URL}/api/generate`);

      const response = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic.trim(),
          audience,
          tone,
          length,
        }),
      });

      const data = await response.json();

      console.log("Backend response status:", response.status);

      if (!response.ok) {
        throw new Error(
          data.error || `Request failed with status ${response.status}.`
        );
      }

      setNewsletter(data.newsletter || "");
      setSuccess("Your newsletter was generated successfully!");
    } catch (err) {
      console.error("Newsletter generation error:", err);

      if (err.message === "Failed to fetch") {
        setError(
          "Cannot connect to the backend. Make sure server.js is running on port 5000."
        );
      } else {
        setError(err.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function testConnection() {
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/api/test`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Connection test failed.");
      }

      setSuccess(data.message);
      console.log("Backend connection test:", data);
    } catch (err) {
      console.error("Connection test failed:", err);

      setError(
        "Cannot connect to the backend. Check that it is running on port 5000."
      );
    }
  }

  function downloadNewsletter() {
    if (!newsletter) return;

    const blob = new Blob([newsletter], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "my-newsletter.txt";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  async function copyNewsletter() {
    if (!newsletter) return;

    try {
      await navigator.clipboard.writeText(newsletter);
      setSuccess("Newsletter copied to clipboard!");
    } catch (err) {
      console.error("Copy failed:", err);
      setError(
        "Copy failed. Select the newsletter text and copy it manually."
      );
    }
  }

  return (
    <div className="app">
      <header className="header">
        <nav className="navbar">
          <a className="brand" href="#home">
            <span className="brand-icon">✉</span>
            <span>NewsCraft AI</span>
          </a>

          <button
            className="test-button"
            type="button"
            onClick={testConnection}
          >
            Test Connection
          </button>
        </nav>

        <div className="hero" id="home">
          <span className="badge">✦ AI-POWERED WRITING</span>

          <h1>
            Create newsletters
            <br />
            <span>that inspire.</span>
          </h1>

          <p>
            Turn your ideas into engaging newsletters in seconds
            with the power of artificial intelligence.
          </p>
        </div>
      </header>

      <main className="container">
        <section className="form-card">
          <div className="section-heading">
            <div>
              <h2>Create your newsletter</h2>
              <p>Customize your content to match your audience.</p>
            </div>

            <span className="sparkle">✦</span>
          </div>

          <form onSubmit={generateNewsletter}>
            <label htmlFor="topic">Newsletter topic</label>

            <input
              id="topic"
              type="text"
              placeholder="e.g. AI trends, technology, education..."
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              maxLength={500}
              required
            />

            <div className="form-row">
              <div>
                <label htmlFor="audience">Target audience</label>

                <select
                  id="audience"
                  value={audience}
                  onChange={(event) => setAudience(event.target.value)}
                >
                  <option>College Students</option>
                  <option>Business Professionals</option>
                  <option>Entrepreneurs</option>
                  <option>General Readers</option>
                  <option>Developers</option>
                  <option>Teachers</option>
                </select>
              </div>

              <div>
                <label htmlFor="tone">Writing tone</label>

                <select
                  id="tone"
                  value={tone}
                  onChange={(event) => setTone(event.target.value)}
                >
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Creative</option>
                  <option>Informative</option>
                  <option>Casual</option>
                </select>
              </div>
            </div>

            <label htmlFor="length">Newsletter length</label>

            <select
              id="length"
              value={length}
              onChange={(event) => setLength(event.target.value)}
            >
              <option>Short</option>
              <option>Medium</option>
              <option>Long</option>
            </select>

            {error && (
              <div className="error-message" role="alert">
                ⚠ {error}
              </div>
            )}

            {success && (
              <div className="success-message" role="status">
                ✓ {success}
              </div>
            )}

            <button
              className="generate-button"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating your newsletter...
                </>
              ) : (
                <>✦ Generate Newsletter</>
              )}
            </button>
          </form>

          <p className="privacy-note">
            ✨ Your ideas, transformed with AI.
          </p>
        </section>

        {newsletter && (
          <section className="newsletter-card">
            <div className="newsletter-header">
              <div>
                <span className="badge">YOUR AI NEWSLETTER</span>
                <h2>Your newsletter is ready!</h2>
                <p>Edit your content before downloading.</p>
              </div>

              <span className="success-icon">✓</span>
            </div>

            <textarea
              className="newsletter-editor"
              aria-label="Edit your newsletter"
              value={newsletter}
              onChange={(event) => setNewsletter(event.target.value)}
              rows={18}
            />

            <div className="newsletter-actions">
              <button
                className="download-button"
                onClick={downloadNewsletter}
                type="button"
              >
                ↓ Download TXT
              </button>

              <button
                className="copy-button"
                onClick={copyNewsletter}
                type="button"
              >
                Copy Newsletter
              </button>
            </div>
          </section>
        )}

        <section className="features">
          <div className="feature">
            <span>✦</span>
            <h3>AI-Powered</h3>
            <p>Generate engaging content from any topic.</p>
          </div>

          <div className="feature">
            <span>◎</span>
            <h3>Personalized</h3>
            <p>Choose the tone and audience you want.</p>
          </div>

          <div className="feature">
            <span>↓</span>
            <h3>Ready to Use</h3>
            <p>Edit and download your newsletter easily.</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>NewsCraft AI · Create something worth reading.</p>
      </footer>
    </div>
  );
}

export default App;