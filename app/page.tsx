export default async function Home() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/home`, {
        cache: 'no-store'
          });
            const data = await res.json();

              return (
                  <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
                        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-2xl shadow-2xl max-w-lg text-center">
                                <h1 className="text-4xl font-bold mb-4 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
                                          {data?.data?.MainTitle || "这是一个神秘的地方"}
                                                  </h1>
                                                          <p className="text-xl text-gray-300">
                                                                    {data?.data?.SubTitle || "这里有神秘的力量"}
                                                                            </p>
                                                                                  </div>
                                                                                      </main>
                                                                                        );
                                                                                        }