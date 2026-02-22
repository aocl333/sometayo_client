/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    kakao: typeof kakao;
  }
}

export interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

export interface KakaoMapInstance {
  setCenter(latlng: KakaoLatLng): void;
  getCenter(): KakaoLatLng;
  setLevel(level: number): void;
}

export interface KakaoMarkerInstance {
  setPosition(latlng: KakaoLatLng): void;
  getPosition(): KakaoLatLng;
  setMap(map: KakaoMapInstance | null): void;
  setImage?(image: unknown): void;
}

declare const kakao: {
  maps: {
    load(callback: () => void): void;
    LatLng: new (lat: number, lng: number) => KakaoLatLng;
    Map: new (container: HTMLElement, options: { center: KakaoLatLng; level?: number }) => KakaoMapInstance;
    Marker: new (options: {
      position: KakaoLatLng;
      map?: KakaoMapInstance | null;
      image?: unknown;
    }) => KakaoMarkerInstance;
    event: {
      addListener(
        target: KakaoMarkerInstance,
        type: string,
        handler: () => void
      ): void;
    };
    MarkerImage: new (
      src: string,
      size: { width: number; height: number },
      options?: { offset?: { x: number; y: number } }
    ) => unknown;
  };
};

export {};
