import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import './MainPage.scss'
import BookCard from '../../components/BookCard/BookCard';
import EventCard from '../../components/EventCard/EventCard';
import { useEffect } from 'react';
import { fetchActualEvents } from '../../features/events/eventsSlice';

const MainPage = () => {
  const user = useAppSelector(state => state.user.user)
  const events = useAppSelector(state => state.events.actualEvents);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchActualEvents());
  }, [dispatch])

  return (
    <div className='page-main'>
      <div className='lcard-info'>
        <div className='lcard-info_text'>
          <span className='lcard-info_label reg-12'>
            Читательский билет № :
          </span>
          <span className='lcard-info_number bold-28'>
            1523 - 5168
          </span>
          <span className='lcard-info_name med-14'>
            {user?.firstName} {user?.lastName}
          </span>
        </div>

        <div className='lcard-info_qr'>
          <div className='lcard-info_qr-temp'></div>
        </div>
      </div>

      <div className='main-books main-block'>
        <div className="main-block_header">
          <h2 className='med-20'>Вам может понравиться</h2>
          <Link to={''} className='main-block_open'>
            <span className='semibold-16'>Все</span>
            <div className='main-block_open-icon'>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0.520001 0.75C0.520001 0.335786 0.855787 0 1.27 0L13.75 0C14.1642 0 14.5 0.335786 14.5 0.75V13.23C14.5 13.6442 14.1642 13.98 13.75 13.98C13.3358 13.98 13 13.6442 13 13.23V2.56066L1.28033 14.2803C0.987437 14.5732 0.512563 14.5732 0.21967 14.2803C-0.0732233 13.9874 -0.0732233 13.5126 0.21967 13.2197L11.9393 1.5L1.27 1.5C0.855787 1.5 0.520001 1.16421 0.520001 0.75Z" fill="#AAB0B6"/>
              </svg>
            </div>
          </Link>
        </div>

        <div className='main-books_list main-block_list'>
          <BookCard />
          <BookCard />
          <BookCard />
          <BookCard />
        </div>
      </div>

      <div className='main-events main-block'>
        <div className="main-block_header">
          <h2 className='med-20'>Ближайшие события</h2>
          <Link to={''} className='main-block_open'>
            <span className='semibold-16'>Все</span>
            <div className='main-block_open-icon'>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0.520001 0.75C0.520001 0.335786 0.855787 0 1.27 0L13.75 0C14.1642 0 14.5 0.335786 14.5 0.75V13.23C14.5 13.6442 14.1642 13.98 13.75 13.98C13.3358 13.98 13 13.6442 13 13.23V2.56066L1.28033 14.2803C0.987437 14.5732 0.512563 14.5732 0.21967 14.2803C-0.0732233 13.9874 -0.0732233 13.5126 0.21967 13.2197L11.9393 1.5L1.27 1.5C0.855787 1.5 0.520001 1.16421 0.520001 0.75Z" fill="#AAB0B6"/>
              </svg>
            </div>
          </Link>
        </div>

        {events.length > 0 && (
          <div className='main-events_list main-block_list'>
            <EventCard event={events[0]} />
            <EventCard event={events[1]} />
          </div>
        )}
      </div>
    </div>
  )
}

export default MainPage;