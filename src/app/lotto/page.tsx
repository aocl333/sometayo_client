'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { MobileLayout, Header, BottomNav } from '@/components/layout';
import { Card } from '@/components/ui';
import { mockCurrentRound, mockUserLottos, mockLottoHistory, formatPrize, getDaysUntilDraw, getLottoBallColor } from '@/mocks/lotto';
import styles from './page.module.scss';

const formatDrawDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} 추첨`;
};

export default function LottoPage() {
  const daysUntil = getDaysUntilDraw(mockCurrentRound.drawDate);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const totalTickets = mockUserLottos.length;
  const completedCount = mockUserLottos.filter(t => t.isComplete).length;
  const currentHistory = mockLottoHistory[historyIndex];
  const canPrev = historyIndex > 0;
  const canNext = historyIndex < mockLottoHistory.length - 1;

  return (
    <MobileLayout>
      <Header title="로또함" showBack />
      
      <main className={styles.main}>
        {/* 현재 회차 정보 */}
        <Card className={styles.roundCard}>
          <div className={styles.roundTop}>
            <span className={styles.roundLabel}>제{mockCurrentRound.round}회</span>
            <div className={styles.dday}>
              <Calendar size={14} />
              <span>D-{daysUntil}</span>
            </div>
          </div>
          <h2 className={styles.prize}>{formatPrize(mockCurrentRound.prize)}</h2>
          <div className={styles.drawDate}>
            추첨일 : {new Date(mockCurrentRound.drawDate).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'short'
            })}
          </div>
        </Card>

        {/* 내 로또 번호 - 카드 리스트 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>
              내 로또 티켓
            </h3>
          </div>

          {/* 모든 티켓 리스트 */}
          <div className={styles.ticketList}>
            {mockUserLottos.map((ticket, idx) => {
              const filledCount = ticket.numbers.filter(n => n !== null).length;
              
              return (
                <Card 
                  key={idx} 
                  className={`${styles.ticketCard} ${ticket.isComplete ? styles.complete : ''}`}
                >
                  <div className={styles.ticketHeader}>
                    <div className={styles.ticketLabel}>
                      {ticket.isComplete ? (
                        <span className={styles.completeIcon}>
                          <Image src="/images/ico_checked.svg" alt="완성" width={15} height={15} />
                        </span>
                      ) : (
                        <span className={styles.ticketNum}>{idx + 1}</span>
                      )}
                      <span>{idx + 1}번 티켓</span>
                    </div>
                    <span className={styles.ticketStatus}>
                      {ticket.isComplete ? '완성!' : `${filledCount}/6`}
                    </span>
                  </div>
                  
                  <div className={styles.ticketBalls}>
                    {ticket.numbers.map((num, ballIdx) => (
                      <div
                        key={ballIdx}
                        className={`${styles.ball} ${num !== null ? styles.filled : styles.empty}`}
                        style={
                          num !== null
                            ? {
                                backgroundColor: getLottoBallColor(num),
                                color: 'white',
                              }
                            : undefined
                        }
                      >
                        {num !== null ? num : '?'}
                      </div>
                    ))}
                  </div>

                  {!ticket.isComplete && (
                    <div className={styles.progressArea}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${(filledCount / 6) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </section>

        {/* 번호 획득 방법 - 카드 UI */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>번호 획득 방법</h3>
          <div className={styles.methodCards}>
            <div className={styles.methodCard}>
              <div className={styles.methodIcon} style={{ background: 'rgba(255, 215, 0, 0.15)' }}>
                <svg width={24} viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M21.5 10.4118V6C21.5 4.34315 20.1569 3 18.5 3H5.5C3.84315 3 2.5 4.34315 2.5 6V10.4118M21.5 10.4118V18C21.5 19.6569 20.1569 21 18.5 21H5.5C3.84315 21 2.5 19.6569 2.5 18V10.4118M21.5 10.4118H13.8095M2.5 10.4118H10.1905" stroke="#FFD700" strokeWidth={1.8} />
                  <path d="M10.375 8.98863H13.625C13.6802 8.98863 13.7246 9.03301 13.7246 9.08824V12.4564C13.7246 12.4965 13.7009 12.5325 13.6641 12.5482L12.0391 13.2406C12.0141 13.2512 11.9859 13.2512 11.9609 13.2406L10.3359 12.5482C10.2991 12.5325 10.2754 12.4965 10.2754 12.4564V9.08824C10.2754 9.03301 10.3198 8.98863 10.375 8.98863Z" stroke="#FFD700" strokeWidth={1.8} />
                </svg>
              </div>
              <div className={styles.methodInfo}>
                <span className={styles.methodTitle}>보물상자</span>
                <span className={styles.methodDesc}>1~2개 획득</span>
              </div>
            </div>
            <div className={styles.methodCard}>
              <div className={styles.methodIcon} style={{ background: 'rgba(33, 150, 243, 0.15)', color: '#2196F3' }}>
                <svg width={26} viewBox="0 0 20 20" fill="none" aria-hidden>
                  <path d="M16 3.33334H4C3.175 3.33334 2.5 4.00834 2.5 4.83334V15.9191C2.5 16.81 3.57714 17.2562 4.20711 16.6262L5.20711 15.6262C5.39464 15.4387 5.649 15.3333 5.91421 15.3333H16C16.825 15.3333 17.5 14.6583 17.5 13.8333V4.83334C17.5 4.00834 16.825 3.33334 16 3.33334ZM16 12.8333C16 13.3856 15.5523 13.8333 15 13.8333H5.05924C4.94287 13.8333 4.83127 13.8796 4.74899 13.9619C4.4726 14.2382 4 14.0425 4 13.6516V5.83334C4 5.28106 4.44772 4.83334 5 4.83334H15C15.5523 4.83334 16 5.28106 16 5.83334V12.8333Z" fill="currentColor" />
                  <path d="M9.99998 11.153L11.4977 12.1008C11.772 12.2746 12.1077 12.0178 12.0355 11.693L11.6385 9.91058L12.963 8.70971C13.2048 8.49068 13.0749 8.07529 12.7573 8.04885L11.0141 7.89403L10.332 6.20979C10.2093 5.90391 9.79065 5.90391 9.66795 6.20979L8.98584 7.89025L7.24268 8.04508C6.92508 8.07151 6.79516 8.48691 7.03696 8.70593L8.36148 9.9068L7.96448 11.6892C7.8923 12.014 8.22794 12.2708 8.50223 12.0971L9.99998 11.153Z" fill="currentColor" />
                </svg>
              </div>
              <div className={styles.methodInfo}>
                <span className={styles.methodTitle}>리뷰 작성</span>
                <span className={styles.methodDesc}>1개 획득</span>
              </div>
            </div>
            <div className={styles.methodCard}>
              <div className={styles.methodIcon} style={{ background: 'rgba(76, 175, 80, 0.15)', color: '#4CAF50' }}>
                <svg width={26} viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 3C10.1441 3.00213 8.36488 3.74784 7.05258 5.07354C5.74028 6.39925 5.00211 8.19667 5 10.0715C5 16.1225 11.3636 20.6924 11.6349 20.8837C11.7419 20.9594 11.8694 21 12 21C12.1306 21 12.2581 20.9594 12.3651 20.8837C12.6364 20.6924 19 16.1225 19 10.0715C18.9979 8.19667 18.2597 6.39925 16.9474 5.07354C15.6351 3.74784 13.8559 3.00213 12 3ZM12 7.50004C12.5034 7.50004 12.9956 7.65086 13.4142 7.93341C13.8328 8.21597 14.159 8.61757 14.3517 9.08745C14.5444 9.55732 14.5948 10.0744 14.4965 10.5732C14.3983 11.072 14.1559 11.5302 13.7999 11.8898C13.4439 12.2494 12.9904 12.4943 12.4966 12.5935C12.0028 12.6928 11.491 12.6418 11.0259 12.4472C10.5608 12.2526 10.1632 11.923 9.88353 11.5001C9.60383 11.0772 9.45455 10.5801 9.45455 10.0715C9.45455 9.38951 9.72273 8.73545 10.2001 8.25321C10.6775 7.77097 11.3249 7.50004 12 7.50004Z" stroke="currentColor" strokeWidth={1.8} />
                </svg>
              </div>
              <div className={styles.methodInfo}>
                <span className={styles.methodTitle}>방문 인증</span>
                <span className={styles.methodDesc}>1개 획득</span>
              </div>
            </div>
          </div>
        </section>

        {/* 지난 회차 결과 - 슬라이더 */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>지난 회차 결과</h3>
          <div className={styles.historySlider}>
            <button
              type="button"
              className={styles.sliderArrow}
              onClick={() => setHistoryIndex((i) => Math.max(0, i - 1))}
              disabled={!canPrev}
              aria-label="이전 회차"
            >
              <ChevronLeft size={24} />
            </button>
            <div className={styles.sliderHeader}>
              <span className={styles.sliderRound}>제{currentHistory.round.round}회</span>
              <span className={styles.sliderDate}>{formatDrawDate(currentHistory.round.drawDate)}</span>
            </div>
            <button
              type="button"
              className={styles.sliderArrow}
              onClick={() => setHistoryIndex((i) => Math.min(mockLottoHistory.length - 1, i + 1))}
              disabled={!canNext}
              aria-label="다음 회차"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <div className={styles.historyCardWrapper}>
            <Card key={currentHistory.round.id} className={styles.historyCard} padding="sm">
              <div className={styles.numbersRow}>
                <div className={styles.numbersGroup}>
                  <span className={styles.numbersLabel}>당첨번호</span>
                  <div className={styles.smallBalls}>
                    {currentHistory.round.winningNumbers?.map((n, i) => (
                      <span
                        key={i}
                        className={styles.smallBall}
                        style={{
                          backgroundColor: getLottoBallColor(n),
                          color: 'white',
                        }}
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.numbersGroup}>
                  <span className={styles.numbersLabel}>내 번호</span>
                  <div className={styles.smallBalls}>
                    {currentHistory.userNumbers.map((n, i) => (
                      <span
                        key={i}
                        className={styles.smallBall}
                        style={{
                          backgroundColor: getLottoBallColor(n),
                          color: 'white',
                        }}
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.historyFooter}>
                <span className={styles.prizeWon}>
                  당첨금 : {formatPrize(currentHistory.prize)}
                </span>
                {currentHistory.matchCount > 0 && (
                  <span className={styles.matchCount}>{currentHistory.matchCount}개 일치</span>
                )}
              </div>
            </Card>
          </div>
        </section>
      </main>

      <BottomNav />
    </MobileLayout>
  );
}
