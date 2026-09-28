import Image from "next/image";

const REVIEWS = [1, 2, 3, 4, 5, 6, 7, 8];

export function SocialProof() {
  return (
    <section className="tight" aria-label="ความน่าเชื่อถือและรีวิว">
      <div className="wrap">
        <div className="stats">
          <div className="stat">
            <p className="num">100+</p>
            <p className="label">
              ประสบการณ์ดูแลคนไข้
              <br />
              กว่า 100 ครอบครัว
            </p>
          </div>
          
        </div>
      </div>

      <div className="wrap">
        <ul className="reviews" aria-label="รีวิวจากคนไข้">
          {REVIEWS.map((n) => (
            <li className="review" key={n}>
              <Image
                className="review-img"
                src={`/images/careconnect_customer_reviews/${n}.png`}
                alt={`รีวิวจากคนไข้ ${n}`}
                width={320}
                height={320}
                sizes="320px"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
