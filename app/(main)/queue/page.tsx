import Queue from "@/components/queue";

export default async function QueuePage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="max-w-2xl m-auto px-2">
          <span className="inline-block mb-2">Queue</span>
          <Queue />
        </div>
      </div>
    </div>
  );
}
