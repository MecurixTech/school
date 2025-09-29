const EventList = ({ dateParam }: { dateParam?: string }) => {
  const date = dateParam ? new Date(dateParam) : new Date();

  // Static demo events
  const demoEvents = [
    {
      id: "1",
      title: "School Assembly",
      description: "Morning assembly for all students.",
      startTime: new Date(date.setHours(8, 0, 0, 0)),
    },
    {
      id: "2",
      title: "Math Class",
      description: "Algebra lesson for grade 10.",
      startTime: new Date(date.setHours(10, 0, 0, 0)),
    },
    {
      id: "3",
      title: "Science Lab",
      description: "Physics experiment session.",
      startTime: new Date(date.setHours(13, 30, 0, 0)),
    },
  ];

  return (
    <>
      {demoEvents.map((event) => (
        <div
          className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
          key={event.id}
        >
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-gray-600">{event.title}</h1>
            <span className="text-gray-300 text-xs">
              {event.startTime.toLocaleTimeString("en-UK", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </span>
          </div>
          <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
        </div>
      ))}
    </>
  );
};

export default EventList;
