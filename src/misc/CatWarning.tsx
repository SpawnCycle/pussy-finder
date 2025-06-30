import { useState } from "react";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CatWarning() {
  const [consent, setConsent] = useState<boolean>(false);

  if (!consent)
    return (
      <>
        <div
          className={
            "fixed top-0 left-0 w-screen h-screen backdrop-blur-md z-30"
          }
        />
        <div
          className="fixed translate-x-[-50%] translate-y-[-50%] left-1/2 top-1/2 
          max-[550px]:min-w-4/5 min-w-[425px] max-h-4/5 bg-card rounded-md
          p-3 z-40"
        >
          <Dialog>
            <DialogHeader>
              <DialogTitle className="p-1">Warning</DialogTitle>
              <DialogDescription>
                This website contains pictures of pussies
              </DialogDescription>
            </DialogHeader>
            <div className="text-center">
              You must love pussies to continue.
            </div>
            <div className="text-center">
              Do you consent to being shown pussies to?
            </div>
            <div className="flex">
              <Button
                className="mr-auto ml-2 my-3"
                variant={"default"}
                onClick={() => setConsent(true)}
              >
                Consent
              </Button>
              <Button
                className="ml-auto mr-2 my-3"
                variant={"secondary"}
                onClick={() =>
                  (window.location.href = "https://cornhub.website/")
                }
              >
                Do not consent
              </Button>
            </div>
          </Dialog>
        </div>
      </>
    );
}
