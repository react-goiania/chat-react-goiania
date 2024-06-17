function Rooms() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 ">Rooms</h1>

      {Array(10)
        .fill(0)
        .map((_, index) => {
          return (
            <a href="/chat" key={index}>
              <div className="p-4 mb-2 bg-blue-700 rounded-md">
                <p>Room {index}</p>
              </div>
            </a>
          );
        })}
    </div>
  );
}

export default Rooms;
