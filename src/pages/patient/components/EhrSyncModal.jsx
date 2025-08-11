// EHRSync.jsx
import React, { useCallback, useMemo, useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Link as LinkIcon,
  RefreshCw,
} from "lucide-react";

/**
 * EHRSync Page
 *
 * Props:
 * - ehrToken?: string  (optional) Bearer token; if omitted, falls back to localStorage.getItem("token")
 * - loginEndpoint?: string (optional override for EHR login GET endpoint)
 * - patientEndpoint?: string (optional override for FHIR patient POST endpoint)
 *
 * Usage:
 *   <EHRSync />
 *   // or
 *   <EHRSync ehrToken={tokenFromContext} />
 */
export default function EHRSync({
  onClose,
  ehrToken,
  loginEndpoint = "https://a4do66e8y1.execute-api.us-east-1.amazonaws.com/dev/api/patient/fhir/login/",
  patientEndpoint = "https://a4do66e8y1.execute-api.us-east-1.amazonaws.com/api/fhir/patient/",
}) {
  // ---- State: Step 1 (Login/Redirect) ----
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  // ---- State: Step 2 (FHIR patient POST) ----
  const [fhirId, setFhirId] = useState("");
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState("");
  const [postResult, setPostResult] = useState(null);

  const bearer = useMemo(() => {
    return (
      ehrToken ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : "") ||
      ""
    );
  }, [ehrToken]);

  // Try to extract a link from varied response shapes
  const extractUrlFromResponse = useCallback((data) => {
    if (!data || typeof data !== "object") return "";
    if (typeof data.url === "string") return data.url;
    if (typeof data.redirectUrl === "string") return data.redirectUrl;
    if (typeof data.link === "string") return data.link;
    if (data.data) {
      if (typeof data.data.url === "string") return data.data.url;
      if (typeof data.data.link === "string") return data.data.link;
      if (typeof data.data.redirectUrl === "string")
        return data.data.redirectUrl;
    }
    // Fallback: first URL-looking string
    try {
      const m = JSON.stringify(data).match(/https?:\/\/[^\s"']+/g);
      return m?.[0] || "";
    } catch {
      return "";
    }
  }, []);

  // ---- Step 1: Call EHR login GET ----
  const handleEhrLogin = async () => {
    setLoginLoading(true);
    setLoginError("");
    setRedirectUrl("");

    try {
      const res = await fetch(loginEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
        },
      });

      const text = await res.text();
      let json = null;
      try {
        json = JSON.parse(text);
      } catch {
        // not JSON; we’ll just look for a URL string in raw text
      }

      if (!res.ok) {
        const msg =
          (json && (json.message || json.error)) ||
          text ||
          `HTTP ${res.status}`;
        throw new Error(msg);
      }

      const url = json
        ? extractUrlFromResponse(json)
        : extractUrlFromResponse({ text });

      if (!url) {
        setLoginError("No redirect link found in response.");
      } else {
        setRedirectUrl(url);
      }
    } catch (err) {
      setLoginError(err?.message || "Failed to contact EHR login endpoint.");
    } finally {
      setLoginLoading(false);
    }
  };

  const goToRedirect = () => {
    if (!redirectUrl) return;
    window.location.href = redirectUrl; // open in same tab
  };

  // ---- Step 2: POST FHIR patient with fhir_id ----
  const handleSubmitFhir = async (e) => {
    e?.preventDefault?.();
    setPostLoading(true);
    setPostError("");
    setPostResult(null);

    try {
      const res = await fetch(patientEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
        },
        body: JSON.stringify({ fhir_id: fhirId }),
      });

      const text = await res.text();
      let json = null;
      try {
        json = JSON.parse(text);
      } catch {
        // raw text fallback
      }

      if (!res.ok) {
        const msg =
          (json && (json.message || json.error)) ||
          text ||
          `HTTP ${res.status}`;
        throw new Error(msg);
      }

      setPostResult(json ?? { text });
    } catch (err) {
      setPostError(err?.message || "Failed to sync patient.");
    } finally {
      setPostLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] w-full px-4 py-6 flex flex-col items-center md:col-span-2 lg:col-span-3">
      <div className="bg-transparent w-full rounded-2xl flex justify-between items-center">
        <button
          onClick={onClose}
          className="flex justify-center items-center text-gray-600 hover:text-gray-800 bg-white/70 px-3 py-1 rounded-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        {/* {Header} */}
      </div>
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1F2544]">
            EHR Sync
          </h1>
          <div className="text-xs text-gray-500">
            Token: {bearer ? "Available" : "Missing (using no auth header)"}
          </div>
        </header>

        {/* Card: Step 1 */}
        <section className="rounded-2xl border border-[#ecebff] bg-white shadow-sm p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-[#2b2d6b] flex items-center gap-2">
            <LinkIcon className="w-5 h-5" /> 1) Start EHR Login
          </h2>
          <p className="mt-1 text-sm text-[#595c7a]">
            Calls the login endpoint and shows a “Continue to EHR” button if a
            redirect link is returned.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleEhrLogin}
              disabled={loginLoading}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#574EB6] to-[#7367F0] hover:from-[#352F6E] hover:to-[#352F6E] shadow-[0_3px_12px_rgba(100,90,209,0.35)] disabled:opacity-60"
            >
              {loginLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
              {loginLoading ? "Contacting EHR…" : "Get EHR Login Link"}
            </button>

            {redirectUrl && (
              <button
                onClick={goToRedirect}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium bg-white border border-[#e5e7eb] hover:bg-gray-50"
              >
                Continue to EHR
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>

          {loginError && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
              {loginError}
            </div>
          )}

          {redirectUrl && (
            <div className="mt-3 text-xs md:text-sm text-[#4b4b63] break-all bg-[#f7f7ff] border border-[#ecebff] rounded-xl p-3">
              <span className="font-medium text-[#2b2d6b]">Redirect Link:</span>{" "}
              {redirectUrl}
            </div>
          )}
        </section>

        {/* Card: Step 2 */}
        <section className="rounded-2xl border border-[#ecebff] bg-white shadow-sm p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-[#2b2d6b]">
            2) After Return: Submit FHIR Patient
          </h2>
          <p className="mt-1 text-sm text-[#595c7a]">
            Enter the{" "}
            <code className="px-1 rounded-md bg-gray-100">fhir_id</code> you
            received after completing the EHR flow and click <b>Sync</b>.
          </p>

          <form
            onSubmit={handleSubmitFhir}
            className="mt-4 flex flex-col gap-3"
          >
            <label className="text-sm font-medium text-[#343a72]">
              FHIR ID
            </label>
            <input
              type="text"
              value={fhirId}
              onChange={(e) => setFhirId(e.target.value)}
              placeholder="egqBHVfQlt4Bw3XGXoxVxHg3"
              className="w-full rounded-xl border border-[#e5e7eb] px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-[#7367F022]"
              required
            />

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={postLoading || !fhirId}
                className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#574EB6] to-[#7367F0] hover:from-[#352F6E] hover:to-[#352F6E] shadow-[0_3px_12px_rgba(100,90,209,0.35)] disabled:opacity-60"
              >
                {postLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                {postLoading ? "Syncing…" : "Sync"}
              </button>
            </div>
          </form>

          {postError && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
              {postError}
            </div>
          )}

          {postResult && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-[#2b2d6b] mb-2">
                Response
              </h3>
              <pre className="text-xs md:text-sm bg-[#0b10211a] text-[#1f2544] p-3 rounded-xl border border-[#e5e7eb] overflow-auto">
                {JSON.stringify(postResult, null, 2)}
              </pre>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
