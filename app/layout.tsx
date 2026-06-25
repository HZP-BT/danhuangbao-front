export default async function Home() {
  // 1. 向 Strapi 后台请求数据（加上 populate=* 才能获取到图片媒体文件）
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/home?populate=*`, {
    cache: 'no-store' // 保证每次刷新都能看到后台最新的修改
  });

  const json = await res.json();
  const data = json.data?.attributes;

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center text-white bg-black">连接服务器失败，请检查数据。</div>;
  }

  // 2. 提取你刚才在后台填写的字段
  const { MainTitle, SubTitle, ButtonText, Announcement, BackgroundImage } = data;

  // 3. 智能处理背景图片链接（拼接上你的后台域名）
  let bgUrl = '';
  if (BackgroundImage?.data?.attributes?.url) {
    bgUrl = BackgroundImage.data.attributes.url;
    if (bgUrl.startsWith('/')) {
      bgUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}${bgUrl}`;
    }
  }

  // 4. 简易解析 Strapi 的富文本公告区块
  let announcementText = "";
  if (Array.isArray(Announcement) && Announcement.length > 0) {
    announcementText = Announcement[0]?.children?.[0]?.text || "";
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gray-950">

      {/* 动态背景图层 */}
      {bgUrl && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen"
          style={{ backgroundImage: `url(${bgUrl})` }}
        />
      )}

      {/* 超酷的液态毛玻璃霓虹卡片 */}
      <div className="relative z-10 p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,255,255,0.15)] text-center max-w-lg w-full mx-4 overflow-hidden">

        {/* 卡片内部的高光反光效果 */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-3xl" />

        {/* 标题区 */}
        <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-blue-500 to-purple-600 filter drop-shadow-[0_0_15px_rgba(0,255,255,0.6)]">
          {MainTitle || '等待数据接入'}
        </h1>

        <p className="text-gray-300 text-xl mb-8 tracking-widest font-light">
          {SubTitle || '...'}
        </p>

        {/* 动态按钮区 */}
        {ButtonText && (
          <button className="px-8 py-3 bg-cyan-500/10 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-full text-cyan-300 transition-all duration-300 shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] tracking-wider font-bold mb-8">
            {ButtonText}
          </button>
        )}

        {/* 公告栏 */}
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
                                                                                                                                                                                                                                                                                                                                                                                                                              
}