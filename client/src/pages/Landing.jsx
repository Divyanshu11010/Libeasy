// import { Button } from "@/components/ui/button";
// import logo from "../assets/logo.png";
// import Footer from "@/components/Footer";

// function Landing() {
//     return (
//         <div className="flex flex-col items-center">
//             <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center px-4">
//                 <div className="w-full max-w-md text-center flex flex-col items-center gap-8">
//                     {/* Logo */}
//                     <img src={logo} />

//                     {/* Description */}
//                     <div className="text-muted-foreground text-base">
//                         Welcome to LibEasy — your all-in-one tool for managing books, borrowing, and library tasks without the hassle.
//                         Enjoy role-based access, automated email alerts, and a sleek admin dashboard built for efficiency.
//                     </div>

//                     {/* Auth Options */}
//                     <div className="w-full dark flex flex-col gap-6 sm:flex-row sm:justify-between">
//                         <Button className="font-bold">
//                             Student Login / Signup
//                         </Button>
//                         <Button className="font-bold">
//                             Admin Login / Signup
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// }

// export default Landing;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import logo from "../assets/logo.png";
import Footer from "@/components/Footer";
import UserAuth from "@/components/UserAuth";
import AdminAuth from "@/components/AdminAuth";

function Landing() {
//   const [openDialog, setOpenDialog] = useState<"student" | "admin" | null>(null);
  const [openDialog, setOpenDialog] = useState();

  return (
    <div className="flex flex-col items-center">
      <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md text-center flex flex-col items-center gap-8">
          {/* Logo */}
          <img src={logo} />

          {/* Description */}
          <div className="text-muted-foreground text-base">
            Welcome to LibEasy — your all-in-one tool for managing books, borrowing, and library tasks without the hassle.
            Enjoy role-based access, automated email alerts, and a sleek admin dashboard built for efficiency.
          </div>

          {/* Auth Options */}
          <div className="w-full dark flex flex-col gap-6 sm:flex-row sm:justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="font-bold"
                  onClick={() => setOpenDialog("user")}
                >
                  Student Login / Signup
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md text-white">
                <DialogHeader>
                  <DialogTitle className="text-center font-semibold text-xl sm:text-2xl">Student Login / Signup</DialogTitle>
                </DialogHeader>
                {openDialog === "user" && <UserAuth />}
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="font-bold"
                  onClick={() => setOpenDialog("admin")}
                >
                  Admin Login / Signup
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center text-white font-semibold text-xl sm:text-2xl">Admin Login / Signup</DialogTitle>
                </DialogHeader>
                {openDialog === "admin" && <AdminAuth />}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Landing;