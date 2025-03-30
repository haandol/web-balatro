export interface Blind {
  id: string;
  name: string;
  chips: number;
  multiplier: number;
}

export const blinds: Blind[] = [
  { id: 'small', name: '스몰 블라인드', chips: 5, multiplier: 1 },
  { id: 'big', name: '빅 블라인드', chips: 10, multiplier: 1.5 },
  { id: 'boss', name: '보스 블라인드', chips: 50, multiplier: 2 }
]; 