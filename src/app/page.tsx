import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default function Home() {
  return (
    <div className="w-screen flex flex-col gap-y-4 p-4">
      <div>
        <Button variant="elevated">This is a button</Button>
      </div>
      <div>
        <Input placeholder="I am an input" />
      </div>
      <div>
        <Progress value={50} />
      </div>
      <div>
        <Textarea placeholder="I am a placeholder" />
      </div>
      <div>
        <Checkbox />
      </div>
    </div>
  );
}
