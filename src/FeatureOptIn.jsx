import { useState } from "react";
import { HoverCard as Card, HoverCardContent as CardContent } from "@radix-ui/react-hover-card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mic, Camera, Shield, Globe, Layers, Usb, AlertTriangle } from "lucide-react";
import { Slider } from "radix-ui";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { Dialog, DialogContent} from "@radix-ui/react-dialog";

const features = [
  { name: "Microphone", icon: <Mic />, tooltip: "Audio from system audio and microphone may be recorded." },
  { name: "Camera", icon: <Camera />, tooltip: "Video from the system web camera or peripheral camera may be recorded." },
  { name: "System Integrity", icon: <Shield />, tooltip: "Operating system details may be collected to ensure the software is running on a legitimate system that is not an emulator or virtual machine." },
  { name: "Browser Tabs", icon: <Globe />, tooltip: "Information about other browser tabs may be collected, including tab title and last time accessed." },
  { name: "Other Applications", icon: <Layers />, tooltip: "Information about other applications installed and/or running on the system may be collected." },
  { name: "Connected Devices", icon: <Usb />, tooltip: "Information about USB or Bluetooth peripherals may be collected." }
];

const retentionPeriods = ["3 days", "1 week", "1 month", "3 months", "1 year"];

export default function FeatureOptIn() {
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
      <div className="flex flex-col items-center p-4 space-y-4 w-full max-w-lg">
        <h1 className="text-xl font-bold">Select Student Data To Collect</h1>
        <div className="grid grid-cols-2 gap-4 w-full">
          {features.map(({ name, icon, tooltip }) => (
            <Tooltip key={name}>
              <TooltipTrigger asChild>
                <Card
                  className={`p-4 flex items-center space-x-3 cursor-pointer border-2 rounded-lg transition w-full ${
                    selectedFeatures.includes(name) ? "border-blue-500" : "border-gray-300"
                  }`}
                  onClick={() => toggleFeature(name)}
                >
                  {icon}
                  <span>{name}</span>
                  {selectedFeatures.includes(name) && <CheckCircle className="text-blue-500" />}
                </Card>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">{tooltip}</TooltipContent>
            </Tooltip>
          ))}
        </div>
        
        {(warningFeature || retentionIndex > 2) && (
          <div className={`p-3 border rounded-md flex items-center space-x-3 w-full ${warningFeature ? 'border-red-500 bg-red-100 text-red-700' : 'border-yellow-500 bg-yellow-100 text-yellow-700'}`}>
            <AlertTriangle size={24} />
            <p>
              {warningFeature
                ? `Warning: If ${warningFeature} data is needed, it is strongly recommended to enable System Integrity collection.`
                : `Warning: Short retention policies are strongly recommended to protect student's personal information. If you have a specific need for this data beyond ${retentionPeriods[retentionIndex]}, continue.`}
            </p>
          </div>
        )}
        
        <div className="w-full max-w-md text-center">
          <h2 className="text-lg font-semibold">Retention Period</h2>
          <Slider
            min={0}
            max={retentionPeriods.length - 1}
            step={1}
            value={[retentionIndex]}
            onValueChange={(value) => setRetentionIndex(value[0])}
          />
          <p className="mt-2 text-sm text-gray-600">{retentionPeriods[retentionIndex]}</p>
        </div>
        
        <div className="flex space-x-4 mt-4">
          <Button 
            className={`${isSaving ? "bg-gray-400" : "bg-black text-white"}`} 
            onClick={toggleSave}
          >
            Save Changes
          </Button>
          <Button className="bg-blue-500 text-white" onClick={exportPrivacyNotice}>
            Export Privacy Notice
          </Button>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <div className="space-y-4">
            <div className="border-t pt-4 mt-4">
              <p className="text-sm text-gray-600">The following defines what data will be collected by Respondus Lockdown Browser and how long it will be stored for virtually administered quizzes and tests in this class. If you have concerns with the information below, please opt for in-person proctoring in the testing center.</p>
            </div>
            {selectedFeatures.map((feature) => {
              const featureData = features.find((f) => f.name === feature);
              return (
                <div key={feature}>
                  <h3 className="text-lg font-semibold">{feature}</h3>
                  <p className="text-sm text-gray-600">{featureData?.tooltip}</p>
                </div>
              );
            })}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold">Retention Period</h3>
              <p className="text-sm text-gray-600">The retention period defines that the data from a testing session will be stored on Respondus servers for {retentionPeriods[retentionIndex]} before being deleted.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

