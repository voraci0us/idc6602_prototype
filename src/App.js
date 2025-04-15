import React, { useState } from "react";
import ReactDOM from "react-dom";

// ========= ICONS =========
const CheckCircle = () => <span role="img" aria-label="check">✅</span>;
const Mic = () => <span role="img" aria-label="mic">🎤</span>;
const Camera = () => <span role="img" aria-label="camera">📷</span>;
const Shield = () => <span role="img" aria-label="shield">🛡️</span>;
const Globe = () => <span role="img" aria-label="globe">🌐</span>;
const Layers = () => <span role="img" aria-label="layers">📚</span>;
const Usb = () => <span role="img" aria-label="usb">🔌</span>;
const AlertTriangle = () => <span role="img" aria-label="alert">⚠️</span>;

// ========= UI COMPONENTS =========

// Simple Card component with basic styling
const Card = ({ children, onClick, className = "", style = {} }) => {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        border: "2px solid #ccc",
        padding: "1rem",
        borderRadius: "8px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        transition: "border-color 0.2s",
        ...style,  // Merge in any custom styles passed in
      }}
    >
      {children}
    </div>
  );
};

// Simple Button component
const Button = ({ children, onClick, className = "", disabled = false }) => {
  return (
    <button
      onClick={onClick}
      className={className}
      disabled={disabled}
      style={{
        padding: "0.5rem 1rem",
        borderRadius: "4px",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
};

// Slider implemented with the HTML range input.
const Slider = ({ min, max, step, value, onValueChange }) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onValueChange([+e.target.value])}
      style={{ width: "100%" }}
    />
  );
};

// ========= TOOLTIP COMPONENTS =========

// TooltipProvider can simply pass through children in this simple implementation.
const TooltipProvider = ({ children }) => <>{children}</>;

// TooltipTrigger: wraps the element that will show the tooltip on hover.
const TooltipTrigger = ({ children }) => children;

// TooltipContent: the tooltip message.
const TooltipContent = ({ children }) => <>{children}</>;

// Tooltip component that expects exactly two children:
// first: TooltipTrigger; second: TooltipContent.
const Tooltip = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [trigger, content] = React.Children.toArray(children);
  
  // Use a common handler on the parent container
  const handleMouseEnter = () => setVisible(true);
  const handleMouseLeave = () => setVisible(false);
  
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative", display: "inline-block" }}
    >
      {trigger}
      {visible && (
  <div
    style={{
      position: "absolute",
      top: "110%",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "0.5rem",
      background: "#333",
      color: "#fff",
      borderRadius: "4px",
      maxWidth: "500px",       // Set a max width for wrapping
      whiteSpace: "normal",    // Allow text to wrap within the container
      zIndex: 1000,
    }}
  >
    {content}
  </div>
)}

    </div>
  );
};

// ========= DIALOG (Modal) COMPONENTS =========

// Dialog: renders children in a full-screen overlay if open.
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div
      onClick={() => onOpenChange(false)}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      {React.cloneElement(children, { onClick: (e) => e.stopPropagation() })}
    </div>
  );
};

// DialogContent: container for the dialog’s content.
const DialogContent = ({ children, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        padding: "1rem",
        borderRadius: "8px",
        maxWidth: "500px",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
};

// DialogHeader: container for header information (title).
const DialogHeader = ({ children }) => {
  return (
    <div
      style={{
        borderBottom: "1px solid #ccc",
        marginBottom: "1rem",
        paddingBottom: "0.5rem",
      }}
    >
      {children}
    </div>
  );
};

// DialogTitle: title text inside the header.
const DialogTitle = ({ children }) => {
  return <h2 style={{ margin: 0 }}>{children}</h2>;
};

// ========= FEATURE OPT-IN COMPONENT =========

const features = [
  {
    name: "Microphone",
    icon: <Mic />,
    tooltip: "Audio from system audio and microphone may be recorded.",
  },
  {
    name: "Camera",
    icon: <Camera />,
    tooltip: "Video from the system web camera or peripheral camera may be recorded.",
  },
  {
    name: "System Integrity",
    icon: <Shield />,
    tooltip:
      "Operating system details may be collected to ensure the software is running on a legitimate system that is not an emulator or virtual machine.",
  },
  {
    name: "Browser Tabs",
    icon: <Globe />,
    tooltip: "Information about other browser tabs may be collected, including tab title and last time accessed.",
  },
  {
    name: "Other Applications",
    icon: <Layers />,
    tooltip: "Information about other applications installed and/or running on the system may be collected.",
  },
  {
    name: "Connected Devices",
    icon: <Usb />,
    tooltip: "Information about USB or Bluetooth peripherals may be collected.",
  },
];

const retentionPeriods = ["3 days", "1 week", "1 month", "3 months", "1 year"];

function FeatureOptIn() {
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [retentionIndex, setRetentionIndex] = useState(2);
  const [warningFeature, setWarningFeature] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleFeature = (feature) => {
    const updatedFeatures = selectedFeatures.includes(feature)
      ? selectedFeatures.filter((f) => f !== feature)
      : [...selectedFeatures, feature];
    setSelectedFeatures(updatedFeatures);

    const needsSystemIntegrity = ["Browser Tabs", "Other Applications", "Connected Devices"];
    if (
      needsSystemIntegrity.some((f) => updatedFeatures.includes(f)) &&
      !updatedFeatures.includes("System Integrity")
    ) {
      const triggeredFeature = needsSystemIntegrity.find((f) => updatedFeatures.includes(f));
      setWarningFeature(triggeredFeature);
    } else {
      setWarningFeature(null);
    }
  };

  const toggleSave = () => {
    setIsSaving((prev) => !prev);
  };

  const exportPrivacyNotice = () => {
    setIsDialogOpen(true);
  };

  return (
    <TooltipProvider>
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", maxWidth: "600px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Select Student Data To Collect</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", width: "100%" }}>
        {features.map(({ name, icon, tooltip }) => (
  <Tooltip key={name}>
    <TooltipTrigger>
      <Card
        onClick={() => toggleFeature(name)}
        className={`p-4 flex items-center space-x-3 cursor-pointer border-2 rounded-lg transition ${selectedFeatures.includes(name) ? "border-blue" : "border-gray"}`}
        style={{
          borderColor: selectedFeatures.includes(name) ? "#3b82f6" : "#ccc",
          backgroundColor: selectedFeatures.includes(name) ? "lightgreen" : "#ffcccc", // non-selected boxes now lighter red
        }}
      >
        {icon}
        <span>{name}</span>
      </Card>
    </TooltipTrigger>
    <TooltipContent>{tooltip}</TooltipContent>
  </Tooltip>
))}




        </div>

        {(warningFeature || retentionIndex > 2) && (
          <div
            className={`p-3 border rounded-md flex items-center space-x-3 w-full ${
              warningFeature
                ? "border-red bg-red-light text-red-dark"
                : "border-yellow bg-yellow-light text-yellow-dark"
            }`}
            style={{
              borderColor: warningFeature ? "#f87171" : "#facc15",
              backgroundColor: warningFeature ? "#fee2e2" : "#fef9c3",
              color: warningFeature ? "#b91c1c" : "#854d0e",
            }}
          >
            <AlertTriangle />
            <p>
              {warningFeature
                ? `Warning: If ${warningFeature} data is needed, it is strongly recommended to enable System Integrity collection.`
                : `Warning: Short retention policies are strongly recommended to protect student's personal information. If you have a specific need for this data beyond ${retentionPeriods[retentionIndex]}, continue.`}
            </p>
          </div>
        )}

        <div style={{ maxWidth: "400px", textAlign: "center", width: "100%" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>Retention Period</h2>
          <Slider
            min={0}
            max={retentionPeriods.length - 1}
            step={1}
            value={[retentionIndex]}
            onValueChange={(value) => setRetentionIndex(value[0])}
          />
          <p style={{ marginTop: "0.5rem", color: "#4b5563", fontSize: "0.875rem" }}>
            {retentionPeriods[retentionIndex]}
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Button
            className={`${isSaving ? "disabled-btn" : "active-btn"}`}
            onClick={toggleSave}
            disabled={isSaving}
            style={{
              backgroundColor: isSaving ? "#9ca3af" : "#000",
              color: "#fff",
            }}
          >
            Save Changes
          </Button>
          <Button
            onClick={exportPrivacyNotice}
            style={{
              backgroundColor: "#3b82f6",
              color: "#fff",
            }}
          >
            Export Privacy Notice
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Privacy Notice</DialogTitle>
          </DialogHeader>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ borderTop: "1px solid #ccc", paddingTop: "1rem", marginTop: "1rem" }}>
              <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>
                The following defines what data will be collected by Respondus Lockdown Browser and how long it will be stored for virtually administered quizzes and tests in this class. If you have concerns with the information below, please opt for in-person proctoring in the testing center.
              </p>
            </div>
            {selectedFeatures.map((feature) => {
              const featureData = features.find((f) => f.name === feature);
              return (
                <div key={feature}>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>{feature}</h3>
                  <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>{featureData?.tooltip}</p>
                </div>
              );
            })}
            <div style={{ borderTop: "1px solid #ccc", paddingTop: "1rem", marginTop: "1rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>Retention Period</h3>
              <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>
                The retention period defines that the data from a testing session will be stored on Respondus servers for {retentionPeriods[retentionIndex]} before being deleted.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

// ========= APP COMPONENT =========
function App() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <FeatureOptIn />
    </div>
  );
}

export default App;