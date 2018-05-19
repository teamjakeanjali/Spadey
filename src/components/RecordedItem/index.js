/**
 * RecordedItem
 */

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Report from 'material-ui/svg-icons/av/library-books';
import PlayButton from 'material-ui/svg-icons/av/play-arrow';
import Button from 'components/Button';

/* component styles */
import { styles } from './styles.scss';

export default function RecordedItem(props) {
  const { goToReports, goToRecording, sentiment, transcription } = props;
  const { title, blob, startTime, stopTime } = props.item;
  const createdAt = moment(startTime).format('MMMM DD YYYY, h:mm a');
  const totalSize = (blob.size / 1000000).toFixed(2);
  const length = (moment.duration(stopTime - startTime).asSeconds() / 60)
    .toFixed(2)
    .replace('.', ':');

  return (
    <div className={styles}>
      <div className="item">
        <h2 className="title">{title || 'Recording X'}</h2>
        <div className="created-at">{createdAt}</div>
        <div>
          <Button
            className="play"
            onTouchTap={goToDetailsView.bind(null, goToRecording)}
            secondary={true}
            raised={true}
            floating={true}
            disabled={true}
            icon={<PlayButton />}
          />
        </div>
        <div>
          <Button
            className="report"
            onTouchTap={goToReportsView.bind(null, goToReports)}
            secondary={true}
            raised={true}
            floating={true}
            disabled={true}
            icon={<Report />}
          />
        </div>
        <div className="length">{length}</div>
        <div className="size">{totalSize} MB</div>
      </div>
    </div>
  );
}

function goToDetailsView(onTouchTap) {
  onTouchTap();
}

function goToReportsView(onTouchTap) {
  onTouchTap();
}

RecordedItem.propTypes = {
  item: PropTypes.object.isRequired
};
