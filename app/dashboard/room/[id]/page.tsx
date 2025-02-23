import { RoomContent } from "./room-content"

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Await the params before passing to client component
  const resolvedParams = await params
  return <RoomContent params={resolvedParams} />
}