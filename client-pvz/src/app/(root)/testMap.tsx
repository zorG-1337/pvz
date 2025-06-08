import { getAllPvz } from "@/src/hooks/getAllPvz";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

export function YandexMapTest() {
  const defaultState = {
    center: [54.7388, 55.9721], // Уфа
    zoom: 11,
  };

  const { data, isLoading } = getAllPvz();

  // Если data есть, то формируем массив из координат и адресов
  const pickupPoints = data?.data?.map((pvz: any) => ({
    coords: [pvz.latitude, pvz.longitude],
    name: pvz.address,
  })) || [];

  return (
    <YMaps>
      <div className="rounded-2xl overflow-hidden shadow-md h-full w-full border border-gray-200">
        <Map
          defaultState={defaultState}
          width="100%"
          height="100%"
          modules={['geoObject.addon.balloon']}
        >
          {pickupPoints.map((point: any, idx: any) => (
            <Placemark
              key={idx}
              geometry={point.coords}
              properties={{
                balloonContent: point.name,
              }}
              options={{
                preset: 'islands#redIcon',
              }}
            />
          ))}
        </Map>
      </div>
    </YMaps>
  );
}
