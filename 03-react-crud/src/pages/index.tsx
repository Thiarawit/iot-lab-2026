import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-1.jpg";
import ajPanwitImage from "../assets/images/aj-panwit.jpg";
import coffeeImage from "../assets/images/coffee-1.jpg";

export default function HomePage() {
  return (
    <Layout>
      <section
        className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
        style={{
          backgroundImage: `url(${cafeBackgroundImage})`,
        }}
      >
        <h1 className="text-5xl mb-2">ยินดีต้อนรับสู่ IoT Library & Cafe</h1>
        <h2>ร้านกาแฟที่มีหนังสืออยู่นิดหน่อยให้คุณได้อ่าน</h2>
      </section>

      <section className="container mx-auto py-8">
        <h1>เกี่ยวกับเรา</h1>

        <div className="grid grid-cols-3 gap-4">
          <p className="text-left col-span-2">
            IoT Library & Cafe เป็นร้านกาแฟที่มีหนังสืออยู่นิดหน่อยให้คุณได้อ่าน
            และเรียนรู้เรื่องใหม่ๆ ที่เกี่ยวกับเทคโนโลยี IoT โดยคาเฟ่ของเรานั้น ก่อตั้งขึ้นโดย
            ผศ.ดร. ปานวิทย์ ธุวะนุติ ซึ่งเป็นอาจารย์ในวิชา Internet of Things
            โค้ดชุดนี้เป็นโค้ดตัวอย่างในหัวข้อ Hono และ React ในวิชานี้
          </p>

          <div>
            <img src={ajPanwitImage} alt="Panwit Tuwanut" className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="mt-8 rounded-2xl bg-orange-50 p-6 text-right ring-1 ring-orange-200">
          <p className="text-sm font-medium uppercase tracking-widest text-orange-700">
            ผู้ดูแลคาเฟ่
          </p>
          <h2 className="mt-2 text-2xl font-bold text-neutral-900">
            Krittanut Siripornnoppakhun
          </h2>
          <p className="mt-1 text-sm text-neutral-500">รหัสประจำตัวนักศึกษา: ไม่ได้ระบุ</p>
          <p className="mt-4 leading-7 text-neutral-700">
            IoT Library & Cafe เป็นพื้นที่สบาย ๆ สำหรับคนที่อยากพักจากความวุ่นวาย
            จิบกาแฟดี ๆ และเปิดโลกความรู้จากหนังสือหลากหลายเล่ม
            เหมาะทั้งสำหรับนั่งอ่านหนังสือ ทำงาน หรือแลกเปลี่ยนไอเดียด้าน IoT กับเพื่อน ๆ
            แวะมาเติมพลังและหาแรงบันดาลใจใหม่ได้ทุกวัน
          </p>
        </div>
      </section>

      <section className="w-full flex justify-center">
        <img src={coffeeImage} alt="Coffee" className="w-full" />
      </section>
    </Layout>
  );
}
