import './EventCard.scss'
import temp from '../../assets/temp.png'
import { toggleEventSignup, type EventItem } from '../../features/events/eventsSlice';
import { formatTime, formatToDDMMYYYY } from '../../utils/dateUtils';
import { useAppDispatch } from '../../app/hooks';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: EventItem;
  onInfoClick?: (event: EventItem) => void;
}

const EventCard: React.FC<EventCardProps> = ({event, onInfoClick}) => {
  const dispatch = useAppDispatch();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    dispatch(toggleEventSignup(event.id));
  };

  return (
    <div className='event-card'>
      <button className='event-card_info-btn' onClick={() => onInfoClick?.(event)}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 4.41667C6 4.04848 6.29848 3.75 6.66667 3.75C7.03486 3.75 7.33333 4.04848 7.33333 4.41667C7.33333 4.78486 7.03486 5.08333 6.66667 5.08333C6.29848 5.08333 6 4.78486 6 4.41667ZM6 6.66667C6 6.29848 6.29848 6 6.66667 6C7.03486 6 7.33333 6.29848 7.33333 6.66667V9.33333C7.33333 9.70152 7.03486 10 6.66667 10C6.29848 10 6 9.70152 6 9.33333V6.66667ZM6.66 0C2.98 0 0 2.98667 0 6.66667C0 10.3467 2.98 13.3333 6.66 13.3333C10.3467 13.3333 13.3333 10.3467 13.3333 6.66667C13.3333 2.98667 10.3467 0 6.66 0ZM6.66667 12C3.72 12 1.33333 9.61333 1.33333 6.66667C1.33333 3.72 3.72 1.33333 6.66667 1.33333C9.61333 1.33333 12 3.72 12 6.66667C12 9.61333 9.61333 12 6.66667 12Z" fill="#B0B0B0"/>
        </svg>
      </button>
      <div className='event-card_main'>
        <div className='event-card_img'>
          <img src={temp} alt="" />
        </div>
        <div className='event-card_info'>
          <Link to={`/event/${event.id}`} className="semibold-18 event-card_info-title">
            {event.title}
          </Link>
          <div className='event-card_info-item'>
            <span className='event-card_info-item__label med-12'>
              Дата:
            </span>
            <span className='event-card_info-item__value med-14'>
              {formatToDDMMYYYY(event.time)}
            </span>
          </div>
          <div className='event-card_info-item'>
            <span className='event-card_info-item__label med-12'>
              Время:
            </span>
            <span className='event-card_info-item__value med-14'>
              {formatTime(event.time)}
            </span>
          </div>
          <div className='event-card_info-item'>
            <span className='event-card_info-item__label med-12'>
              Осталось мест: 
            </span>
            <span className='event-card_info-item__value med-14'>
              {event.spots_left}/{event.spots}
            </span>
          </div>
        </div>
      </div>
      <div className='event-card_btns'>
        {event.user_signed_up ? (
          <div className='event-card_signed'>
            <div className='event-card_signed-info semibold-18'>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.219783 6.21967C0.512676 5.92678 0.98755 5.92678 1.28044 6.21967L4.75011 9.68934L14.2198 0.21967C14.5127 -0.073223 14.9875 -0.0732233 15.2804 0.21967C15.5733 0.512563 15.5733 0.987437 15.2804 1.28033L5.28044 11.2803C4.98755 11.5732 4.51268 11.5732 4.21978 11.2803L0.219783 7.28033C-0.07311 6.98744 -0.07311 6.51256 0.219783 6.21967Z" fill="#0D6EFD"/>
              </svg>
              <span>Вы записаны</span>
            </div>
            <button className='event-card_btn-cancel semibold-18' onClick={handleSignUp}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.219748 0.219644C0.512641 -0.0732486 0.987515 -0.0732489 1.28041 0.219644L5.99272 4.93195L10.705 0.219644C10.9979 -0.0732486 11.4728 -0.0732489 11.7657 0.219644C12.0586 0.512537 12.0586 0.987412 11.7657 1.2803L7.05338 5.99261L11.7657 10.7049C12.0586 10.9978 12.0586 11.4727 11.7657 11.7656C11.4728 12.0585 10.9979 12.0585 10.705 11.7656L5.99272 7.05327L1.28041 11.7656C0.987515 12.0585 0.512641 12.0585 0.219748 11.7656C-0.0731455 11.4727 -0.0731455 10.9978 0.219748 10.7049L4.93206 5.99261L0.219748 1.2803C-0.0731455 0.987411 -0.0731455 0.512538 0.219748 0.219644Z" fill="#D7342B"/>
              </svg>
            </button>
          </div>
        ) : (
          <button className='event-card_btn-signup semibold-18' onClick={handleSignUp}>
            Записаться
          </button>
        )}
      </div>
    </div>
  )
}

export default EventCard;