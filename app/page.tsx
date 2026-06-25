export default async function Home() {
  let json;
  try {
    // 1. 发起请求
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/home?populate=*`, {
      cache: 'no-store'
    });
    json = await res.json();
  } catch (e: any) {
    // 如果连网址都没拼对，或者网络直接断了，会显示这里
    return (
      <div className="p-10 text-red-500 bg-black min-h-screen">
        <h1 className="text-2xl font-bold mb-4">前端请求直接崩溃了！</h1>
        <p>错误原因：{e.message}</p>
        <p>检查的环境变量网址：{process.env.NEXT_PUBLIC_STRAPI_URL}/api/home</p>
      </div>
    );
  }
  
  const data = json?.data?.attributes;

  // 2. 如果接口通了，但是拿不到数据，直接把后端的原话“打印”在屏幕上！
  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-black p-10">
        <h1 className="text-2xl font-bold text-red-500 mb-4">前端发出了请求，但数据被拦截了！</h1>
        <p className="mb-4 text-gray-400">后端 Strapi 服务器回复的原文是：</p>
        <pre className="bg-gray-900 p-4 rounded-lg text-green-400 text-sm w-full max-w-md overflow-auto shadow-2xl border border-gray-700 break-all whitespace-pre-wrap">
          {JSON.stringify(json, null, 2)}
        </pre>
      </div>
    );
  }

  // 3. 提取字段
  const { MainTitle, SubTitle, ButtonText, Announcement, BackgroundImage } = data;

  let bgUrl = '';
  if (BackgroundImage?.data?.attributes?.url) {
    bgUrl = BackgroundImage.data.attributes.url;
    if (bgUrl.startsWith('/')) {
      bgUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}${bgUrl}`;
    }
  }

  let announcementText = "";
  if (Array.isArray(Announcement) && Announcement.length > 0) {
    announcementText = Announcement[0]?.children?.[0]?.text || "";
  }

  // 4. 渲染正确的 UI
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gray-950">
      {bgUrl && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen"
          style={{ backgroundImage: `url(${bgUrl})` }}
        />
      )}
      <div className="relative z-10 p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,255,255,0.15)] text-center max-w-lg w-full mx-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-3xl" />
        <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-blue-500 to-purple-600 filter drop-shadow-[0_0_15px_rgba(0,255,255,0.6)]">
          {MainTitle || '等待数据接入'}
        </h1>
        <p className="text-gray-300 text-xl mb-8 tracking-widest font-light">
          {SubTitle || '...'}
        </p>
        {ButtonText && (
          <button className="px-8 py-3 bg-cyan-500/10 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-full text-cyan-300 transition-all duration-300 shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] tracking-wider font-bold mb-8">
            {ButtonText}
          </button>
        )}
        {announcementText && (
          <div className="mt-4 p-5 bg-black/40 rounded-xl border border-gray-700/50 text-sm text-gray-300 text-left backdrop-blur-md">
            <div className="flex items-center mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse mr-2" />
              <h3 className="text-cyan-400 font-bold">终端通讯接通</h3>
            </div>
            <p className="leading-relaxed">{announcementText}</p>
          </div>
        )}
      </div>
    </main>
  );
}
