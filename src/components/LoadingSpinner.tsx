import { useNavigation } from "react-router-dom";
import { Loader2 } from "lucide-react";

export const LoaderSpinner = () => {
  const navigation = useNavigation();

  return (
    <>
      {navigation.state === "loading" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      )}
    </>
  );
};
