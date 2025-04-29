import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl text-center space-y-6">
        <h1 className="text-6xl font-bold tracking-tight">Recap</h1>
        <p className="text-xl text-muted-foreground">
          Stay organized, share notes, and track updates with your team
          effortlessly.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/login")}>
            Get Started
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
