import React from 'react';
import Stream from '../containers/Stream';
import Slot from 'coral-framework/components/Slot';
import {can} from 'coral-framework/services/perms';
import t from 'coral-framework/services/i18n';

import {TabBar, Tab, TabContent, Button} from 'coral-ui';
import Count from 'coral-plugin-comment-count/CommentCount';
import ProfileContainer from 'coral-settings/containers/ProfileContainer';
import ConfigureStreamContainer
  from 'coral-configure/containers/ConfigureStreamContainer';
import cn from 'classnames';

export default class Embed extends React.Component {
  changeTab = (tab) => {
    switch (tab) {
    case 0:
      this.props.setActiveTab('stream');
      break;
    case 1:
      this.props.setActiveTab('profile');

        // TODO: move data fetching to profile container.
      this.props.data.refetch();
      break;
    case 2:
      this.props.setActiveTab('config');

        // TODO: move data fetching to config container.
      this.props.data.refetch();
      break;
    }
  };

  handleShowProfile = () => this.props.setActiveTab('profile');

  render() {
    const {activeTab, viewAllComments, commentId} = this.props;
    const {asset: {totalCommentCount}} = this.props.root;
    const {user} = this.props.auth;
    const hasHighlightedComment = !!commentId;

    return (
      <div className={cn('talk-embed-stream', {'talk-embed-stream-highlight-comment': hasHighlightedComment})}>
        <TabBar onChange={this.changeTab} activeTab={activeTab} className='talk-embed-stream-tabbar'>
          <Tab className={'talk-embed-stream-comments-tab'} id='stream'><Count count={totalCommentCount}/></Tab>
          <Tab className={'talk-embed-stream-profile-tab'} id='profile'>{t('framework.my_profile')}</Tab>
          <Tab className={'talk-embed-stream-configuration-tab'} id='config' restricted={!can(user, 'UPDATE_CONFIG')}>
            {t('framework.configure_stream')}
          </Tab>
        </TabBar>
        {commentId &&
          <Button
            cStyle="darkGrey"
            style={{float: 'right'}}
            onClick={viewAllComments}
            className={'talk-embed-stream-show-all-comments-button'}
          >
            {t('framework.show_all_comments')}
          </Button>}
        <Slot fill="embed" />
        <TabContent show={activeTab === 'stream'}>
          <Stream data={this.props.data} root={this.props.root} />
        </TabContent>
        <TabContent show={activeTab === 'profile'}>
          <ProfileContainer />
        </TabContent>
        <TabContent show={activeTab === 'config'}>
          <ConfigureStreamContainer />
        </TabContent>
      </div>
    );
  }
}

Embed.propTypes = {
  data: React.PropTypes.shape({
    loading: React.PropTypes.bool,
    error: React.PropTypes.object
  }).isRequired
};
