import "./App.css";
import PrayerCard from "./PrayerCard";
import { useEffect, useState } from "react";
import axiosClient from "./utils/axiosClient";
import { wilayat } from "./utils/wilayat";

function App() {
  const [date, setDate] = useState("");
  const [place, setPlace] = useState("");
  const [times, setTimes] = useState({
    Fajr: "00:00",
    Dhuhr: "00:00",
    Asr: "00:00",
    Maghrib: "00:00",
    Isha: "00:00",
  });
  const [seconds, setSeconds] = useState(0);
  const [minuts, setMinuts] = useState(0);
  const [hours, setHours] = useState(0);
  const [saha, setSaha] = useState(false);

  const getDifference = () => {
    const nowDate = new Date();
    const magreb = new Date();
    const m = times.Maghrib;
    const [hours, minuts] = m.split(":");
    magreb.setHours(hours, minuts, 0, 0);
    return Math.floor((magreb - nowDate) / 1000);
  };

  useEffect(() => {
    const difference = getDifference();
    if (difference < 0) {
      setSaha(true);
    } else {
      setSaha(false);
      setHours(Math.floor(difference / 3600));
      setMinuts(Math.floor((difference % 3600) / 60));
      setSeconds((difference % 3600) % 60);

      // Set up an interval to update the remaining time every second
      var interval = setInterval(() => {
        setSeconds((s) => {
          if (s === 0) {
            setMinuts((m) => {
              if (m === 0) {
                setHours((h) => {
                  return h - 1;
                });
                return 59;
              } else {
                return m - 1;
              }
            });
            return 59;
          } else {
            return s - 1;
          }
        });
      }, 1000);
    }

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [times]);

  useEffect(() => {
    setPlace(place || "algeria");
    getData(place);
  }, [place]);

  const getData = async (wilaya) => {
    await axiosClient
      .getCityData("algeria", wilaya)
      .then((res) => {
        if (res.data.code === 200) {
          return res.data.data;
        } else {
          throw new Error("Problem In Getting Data");
        }
      })
      .then((data) => {
        console.log(data);
        setTimes(data.timings);
        setDate({
          day: data.date.hijri.day,
          dayName: data.date.hijri.weekday.ar,
          month: data.date.hijri.month.ar,
          year: data.date.hijri.year,
        });
      })
      .catch((error) => {
        console.log("Error Found", error);
      });
  };
  return (
    <div className="main container" dir="rtl">
      <div className="top-bar">
        <div className="section">
          <h4 className="section-header">
            {date ? (
              <>
                <span>{date.dayName} </span>
                <span>{date.day} </span>
                <span>{date.month} </span>
                <span>{date.year} </span>
              </>
            ) : (
              ""
            )}
          </h4>
          <h2 className="section-content">
            {place ? (
              <>
                <span>{place} ,</span>
                <span>الجزائر</span>
              </>
            ) : (
              "جاري التحميل ..."
            )}
          </h2>
        </div>
        <div className="section">
          <h4 className="section-header">متبقي حتى اذان المغرب </h4>
          <h2 className="section-content">
            {!saha ? (
              `${hours.toString().padStart(2, "0")}:${minuts
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
            ) : (
              <h2>صحا فطوركم</h2>
            )}
          </h2>
        </div>
      </div>
      <div className="buttom-bar">
        {times ? (
          <>
            <PrayerCard
              name={"الفجر"}
              time={times.Fajr}
              link={"/fajr-prayer.png"}
            />
            <PrayerCard
              name={"الظهر"}
              time={times.Dhuhr}
              link={"/dhhr-prayer-mosque.png"}
            />
            <PrayerCard
              name={"العصر"}
              time={times.Asr}
              link={"/asr-prayer-mosque.png"}
            />
            <PrayerCard
              name={"المغرب"}
              time={times.Maghrib}
              link={"/sunset-prayer-mosque.png"}
            />
            <PrayerCard
              name={"العشاء"}
              time={times.Isha}
              link={"/night-prayer-mosque.png"}
            />
          </>
        ) : (
          <p>جاري التحميل ...</p>
        )}
      </div>
      <div className="select">
        <select
          name="region"
          id="region"
          onChange={(e) => setPlace(e.target.value)}
        >
          {wilayat.map((wilaya, index) => {
            return (
              <option
                key={index}
                value={wilaya.english}
                selected={wilaya.english == "Alger"}
              >
                {wilaya.arabic}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

export default App;
