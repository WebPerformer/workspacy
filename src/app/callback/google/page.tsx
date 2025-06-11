import Image from "next/image";
import loading from "@/public/images/loading.svg";

export default function GoogleCallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <Image src={loading} alt="loading" width={40} height={40} />
        <p className="text-muted-foreground">Setting up your account...</p>
      </div>
    </div>
  );
}
