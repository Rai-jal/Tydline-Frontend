import InputField from "./ui/InputField";
import Button from "./ui/Button";

function TrackingInput() {
  return (
    <div className="flex items-center justify-center gap-2 w-[55%]">
      <InputField className="flex-1 h-13" />
      <Button className="w-36 h-12" />
    </div>
  );
}

export default TrackingInput;
