import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import vigilEvents from "../../data/vigilEvents.json";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "facebook";

  const dimensions = {
    facebook: { width: 1200, height: 630 },
    twitter: { width: 1200, height: 675 },
    instagram: { width: 1080, height: 1080 },
    whatsapp: { width: 1200, height: 630 },
    messenger: { width: 1200, height: 630 },
  };

  const { width, height } =
    dimensions[type as keyof typeof dimensions] || dimensions.facebook;

  // Sort events by date
  const sortedEvents = [...vigilEvents].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });

  // Get unique provinces
  const provinces = Array.from(
    new Set(vigilEvents.map((event) => event.province))
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#1a1a1a",
          position: "relative",
        }}
      >
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9))",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
            padding: "0 40px",
            textAlign: "center",
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontSize: 48,
              fontWeight: "bold",
              color: "white",
              marginBottom: 20,
              fontFamily: "Times New Roman",
            }}
          >
            Vigil Events Across Canada
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 32,
              color: "white",
              marginBottom: 30,
              fontFamily: "Times New Roman",
            }}
          >
            {provinces.length} Provinces • {vigilEvents.length} Events
          </p>

          {/* Candle */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 30,
            }}
          >
            {/* Flame */}
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "20px solid transparent",
                borderRight: "20px solid transparent",
                borderBottom: "40px solid #ffd700",
                marginBottom: -20,
              }}
            />
            {/* Candle body */}
            <div
              style={{
                width: 40,
                height: 80,
                background: "white",
              }}
            />
          </div>

          {/* Event dates */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "10px",
              maxWidth: "100%",
            }}
          >
            {sortedEvents.slice(0, 6).map((event) => (
              <div
                key={event.city}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  fontSize: "16px",
                  color: "white",
                }}
              >
                {event.city} • {event.date}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      width,
      height,
    }
  );
}
