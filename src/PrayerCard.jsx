export default function PrayerCard({ name, link, time }) {
  return (
    <div className="card">
      <img src={link} />
      <h4>{name}</h4>
      <h2>{time}</h2>
    </div>
  );
}
