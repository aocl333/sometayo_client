'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { mockTreasures } from '@/mocks/treasures';
import type { Store } from '@/types';
import type { TreasureSpot } from '@/types';
import type { KakaoMapInstance, KakaoMarkerInstance } from '@/types/kakao';

const WAIT_KAKAO_MS = 12000;
// 테스트용: 부산 해운대구 대천로67번길 18(좌동) 근처. 위치 못 받을 때 기본 중심.
const INITIAL_CENTER = { lat: 35.1628, lng: 129.1595 };

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 0,
};

// 걸을 때마다 자주 갱신 (캐시 2초 허용해서 위치 업데이트 많이 받기)
const WATCH_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 2000,
};

type MarkerType = 'store' | 'treasure';

interface KakaoMapProps {
  filter: 'all' | MarkerType;
  stores?: Store[];
  onMarkerClick: (type: MarkerType, data: Store | TreasureSpot) => void;
}

export default function KakaoMap({ filter, stores = [], onMarkerClick }: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMapInstance | null>(null);
  const userMarkerRef = useRef<KakaoMarkerInstance | null>(null);
  const storeMarkersRef = useRef<KakaoMarkerInstance[]>([]);
  const treasureMarkersRef = useRef<KakaoMarkerInstance[]>([]);
  const onMarkerClickRef = useRef(onMarkerClick);
  onMarkerClickRef.current = onMarkerClick;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);

  const moveToMyLocation = useCallback(() => {
    if (!mapRef.current || !window.kakao?.maps?.LatLng) return;

    const move = (lat: number, lng: number) => {
      if (!mapRef.current || !userMarkerRef.current) return;
      const latlng = new window.kakao.maps.LatLng(lat, lng);
      userMarkerRef.current.setPosition(latlng);
      userMarkerRef.current.setMap(mapRef.current);
      mapRef.current.setCenter(latlng);
      mapRef.current.setLevel(5);
      setMyLocation({ lat, lng });
      setLocationError(null);
    };

    const tryMove = () => {
      if (!navigator.geolocation) {
        setLocationError('이 브라우저에서는 위치를 사용할 수 없습니다.');
        return;
      }
      if (typeof window !== 'undefined' && !window.isSecureContext) {
        setLocationError('현재 위치는 HTTPS 또는 localhost에서만 사용할 수 있습니다.');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => move(pos.coords.latitude, pos.coords.longitude),
        () => setLocationError('위치 권한을 허용해 주세요.'),
        GEO_OPTIONS
      );
    };

    if (myLocation) {
      move(myLocation.lat, myLocation.lng);
      return;
    }
    tryMove();
  }, [myLocation]);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? '';
    if (!key) {
      setError('NEXT_PUBLIC_KAKAO_MAP_KEY를 .env.local에 설정하세요.');
      setIsLoading(false);
      return;
    }

    let mounted = true;

    const tryInit = () => {
      const k = window.kakao?.maps;
      if (!mounted || !containerRef.current || !k?.LatLng) return;

      const initCenter = new k.LatLng(INITIAL_CENTER.lat, INITIAL_CENTER.lng);
      const map = new k.Map(containerRef.current, { center: initCenter, level: 6 });
      mapRef.current = map;

      // 내 위치 전용 마커: 썸타요 캐릭터(maker.gif) 사용
      const userMarker = new k.Marker({ position: initCenter, map: null });
      const markerImageUrl =
        typeof window !== 'undefined' ? `${window.location.origin}/images/maker.gif` : '/images/maker.gif';
      const kmaps = window.kakao?.maps as {
        MarkerImage?: new (src: string, size: unknown, opts?: { offset?: unknown }) => unknown;
        Size?: new (w: number, h: number) => unknown;
        Point?: new (x: number, y: number) => unknown;
      };
      if (typeof kmaps?.MarkerImage === 'function') {
        const size = typeof kmaps.Size === 'function' ? new kmaps.Size(40, 40) : { width: 40, height: 40 };
        const offset = typeof kmaps.Point === 'function' ? new kmaps.Point(20, 40) : { x: 20, y: 40 };
        const markerImage = new kmaps.MarkerImage(markerImageUrl, size, { offset });
        if (typeof (userMarker as { setImage?: (img: unknown) => void }).setImage === 'function') {
          (userMarker as { setImage: (img: unknown) => void }).setImage(markerImage);
        }
      }
      userMarkerRef.current = userMarker;

      // 가맹점 마커는 stores prop이 채워진 뒤 별도 useEffect에서 그림 (여기서는 빈 배열로 초기화)
      storeMarkersRef.current = [];

      // 테스트: 관광지 마커 1개만 표시하므로 보물상자 마커는 비움
      treasureMarkersRef.current = mockTreasures.filter(() => false).map((treasure) => {
        const pos = new k.LatLng(treasure.position.lat, treasure.position.lng);
        const marker = new k.Marker({ position: pos, map });
        k.event.addListener(marker, 'click', () => onMarkerClickRef.current('treasure', treasure));
        return marker;
      });

      setMapReady(true);
      setIsLoading(false);
      // 첫 위치·실시간 갱신은 watchPosition에서만 처리 (모바일에서 getCurrentPosition 타임아웃 방지)
    };

    const start = Date.now();
    const timer = setInterval(() => {
      if (typeof window.kakao?.maps?.LatLng !== 'function') {
        if (Date.now() - start > WAIT_KAKAO_MS) {
          clearInterval(timer);
          if (mounted) {
            const host = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
            setError(host ? `지도 로드 실패. 카카오 개발자 콘솔 > 플랫폼 > Web > JavaScript SDK 도메인에 "${host}" 를 추가했는지 확인하세요.` : '지도 로드 시간 초과.');
            setIsLoading(false);
          }
        }
        return;
      }
      clearInterval(timer);
      requestAnimationFrame(() => tryInit());
    }, 100);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 지도는 한 번만 초기화. onMarkerClick은 ref로 최신 유지.
  }, []);

  // 가맹점 목록(stores)이 있으면 지도에 마커 그리기
  useEffect(() => {
    if (!mapReady || !mapRef.current || !window.kakao?.maps?.LatLng || stores.length === 0) {
      storeMarkersRef.current = [];
      return;
    }
    const k = window.kakao.maps;
    const map = mapRef.current;
    const storeIconUrl =
      typeof window !== 'undefined' ? `${window.location.origin}/images/ico_shop.svg` : '/images/ico_shop.svg';
    const kmapsForStore = window.kakao?.maps as {
      MarkerImage?: new (src: string, size: unknown, opts?: { offset?: unknown }) => unknown;
      Size?: new (w: number, h: number) => unknown;
      Point?: new (x: number, y: number) => unknown;
    };
    // 기존 스토어 마커 제거
    storeMarkersRef.current.forEach((m) => m.setMap(null));
    storeMarkersRef.current = stores.map((store) => {
      const pos = new k.LatLng(store.position.lat, store.position.lng);
      const marker = new k.Marker({ position: pos, map });
      if (typeof kmapsForStore?.MarkerImage === 'function') {
        const size =
          typeof kmapsForStore.Size === 'function' ? new kmapsForStore.Size(30, 30) : { width: 36, height: 36 };
        const offset =
          typeof kmapsForStore.Point === 'function' ? new kmapsForStore.Point(18, 36) : { x: 18, y: 36 };
        const storeMarkerImage = new kmapsForStore.MarkerImage(storeIconUrl, size, { offset });
        if (typeof (marker as { setImage?: (img: unknown) => void }).setImage === 'function') {
          (marker as { setImage: (img: unknown) => void }).setImage(storeMarkerImage);
        }
      }
      k.event.addListener(marker, 'click', () => onMarkerClickRef.current('store', store));
      return marker;
    });
    const showStore = filter === 'all' || filter === 'store';
    storeMarkersRef.current.forEach((m) => m.setMap(showStore ? map : null));
  }, [mapReady, filter, stores]);

  // 필터에 따라 마커 표시/숨김
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const showStore = filter === 'all' || filter === 'store';
    const showTreasure = filter === 'all' || filter === 'treasure';
    storeMarkersRef.current.forEach((m) => m.setMap(showStore ? mapRef.current : null));
    treasureMarkersRef.current.forEach((m) => m.setMap(showTreasure ? mapRef.current : null));
  }, [mapReady, filter]);

  // 걸을 때마다 실시간 위치: 첫 위치 포함 내 위치 마커 + 지도 중심 (모바일에서 watchPosition으로 처리)
  useEffect(() => {
    if (!mapReady || !userMarkerRef.current || !mapRef.current) return;
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      setLocationError('현재 위치는 HTTPS 또는 localhost에서만 사용할 수 있습니다.');
      return;
    }
    if (!navigator.geolocation) {
      setLocationError('이 브라우저에서는 위치를 사용할 수 없습니다.');
      return;
    }
    setLocationError(null);
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMyLocation({ lat, lng });
        setLocationError(null);
        if (!window.kakao?.maps?.LatLng) return;
        const latlng = new window.kakao.maps.LatLng(lat, lng);
        userMarkerRef.current?.setPosition(latlng);
        userMarkerRef.current?.setMap(mapRef.current);
        mapRef.current?.setCenter(latlng);
        mapRef.current?.setLevel(5);
      },
      (err) => {
        const isInsecure = typeof window !== 'undefined' && !window.isSecureContext;
        const msg = isInsecure
          ? '현재 위치는 HTTPS 또는 localhost에서만 사용할 수 있습니다.'
          : err.code === 1
            ? '위치 권한을 허용해 주세요.'
            : err.code === 3
              ? '위치를 가져오는 중입니다…'
              : '위치를 사용할 수 없습니다.';
        setLocationError(msg);
      },
      WATCH_OPTIONS
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [mapReady]);

  const key = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? '';
  if (!key) {
    return (
      <div className="map-error">
        <p>NEXT_PUBLIC_KAKAO_MAP_KEY를 .env.local에 설정하세요.</p>
      </div>
    );
  }

  return (
    <div className="map-wrapper">
      <div ref={containerRef} className="map-container" style={{ width: '100%', height: '100%' }} />
      {isLoading && (
        <div className="map-loading">
          <p>지도 로딩 중...</p>
        </div>
      )}
      {error && (
        <div className="map-error">
          <p>{error}</p>
        </div>
      )}
      {locationError && !error && (
        <div className="map-location-error" role="alert">
          <p>{locationError}</p>
        </div>
      )}
      <button
        type="button"
        className="map-my-location-btn"
        onClick={moveToMyLocation}
        title="내 위치로 이동"
        aria-label="내 위치로 이동"
      >
        <img src="/images/ico_map_location.svg" alt="" width={24} height={24} />
      </button>
    </div>
  );
}
