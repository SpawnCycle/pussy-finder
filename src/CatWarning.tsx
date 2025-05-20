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
            "fixed top-0 left-0 w-screen h-screen backdrop-blur-md z-10"
          }
        />
        <div
          className="fixed translate-x-[-50%] translate-y-[-50%] left-1/2 top-1/2 
        min-w-[225px] md:max-w-3/5 md:max-h-4/5 max-w-[90%] bg-card rounded-md
        p-3 z-20"
        >
          <Dialog>
            <DialogHeader>
              <DialogTitle className="p-1">Warning</DialogTitle>
              <DialogDescription>
                This website contains pictures of pussies
              </DialogDescription>
            </DialogHeader>
            <div className="text-center">You must love pussies to continue</div>
            <div className="text-center">
              Do you consent to be shown pussies to?
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
