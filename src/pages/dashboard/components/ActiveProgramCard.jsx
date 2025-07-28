const ActiveProgramsCard = ({ noOfPrograms }) => {
  return (
    <div
      className="rounded-3xl p-6 text-white relative overflow-visible w-full h-full border-t-2 border-b-2 border-t-white border-b-white font-inter"
      // style={{
      //   backgroundImage: `url("/active-program-bg.jpeg")`,
      //   backgroundSize: 'cover',
      //   backgroundPosition: 'center',
      // }}
    >
      <div className="absolute top-0 left-0 z-[5] w-full h-full overflow-hidden rounded-3xl">
        <img
          src="/active-program-bg.jpeg"
          alt="bg"
          className="w-full h-full object-cover absolute top-0 left-0 bg-center "
          style={{
            objectPosition: "73% center",
            transform: "scale(1.2)",
          }}
        />
      </div>
      <div className="relative z-10">
        <h3 className="text-lg text-black font-bold">Active Programs</h3>
        <div className="text-[3.75rem] text-[#7267ec] font-bold leading-[1]">
          {noOfPrograms || 0}
        </div>
      </div>
      <div className="absolute -right-5 bottom-0 z-10">
        <div className="w-48 h-48 rounded-full flex items-center justify-center">
          <img src="/chasma.png" alt="Chasma" />
        </div>
      </div>
    </div>
  );
};

export default ActiveProgramsCard;
