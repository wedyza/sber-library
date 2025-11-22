import './EmptyList.scss'
import emptyImg from '../../assets/empty.svg'

interface EmptyListProps {
  text: string;
}

const EmptyList: React.FC<EmptyListProps> = ({text}) => {
  return (
    <div className='empty-list'>
      <div className='empty-list_icon'>
        <img src={emptyImg} alt="" />
      </div>
      <span className='empty-list_text reg-14'>{text}</span>
    </div>
  )
}

export default EmptyList;