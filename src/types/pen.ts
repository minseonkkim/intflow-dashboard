export interface AbnormalPig {
  wid: number;
  thumbnail_url: string;
  activity: number;
  feeding_time: number;
}

export interface Pen {
  pen_id: string;
  pen_name: string;
  current_pig_count: number;
  avg_activity_level: number;
  avg_feeding_time_minutes: number;
  avg_temperature_celsius: number;
  abnormal_pigs: AbnormalPig[];
}

export interface Piggery {
  piggery_id: string;
  piggery_name: string;
  total_pigs: number;
  pens: Pen[];
}

export interface PensResponse {
  piggeies: Piggery[];
}

export interface PenRealtimeData {
  activity: number;
  feeding_time: number;
}

export interface PenRealtimeMessage {
  data: PenRealtimeData;
}

export interface PenRealtimeSample extends PenRealtimeData {
  timestamp: string;
}

export interface PenDetailTimeSeriesPoint {
  activity: number;
  feeding_time: number;
}

export interface PenDetailResponse {
  name: string;
  time_series: PenDetailTimeSeriesPoint[];
}
