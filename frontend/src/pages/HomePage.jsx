import { UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useStreamChat } from "../hooks/useStreamChat";
import PageLoader from "../components/PageLoader";
import { HashIcon, PlusIcon, UserIcon } from "lucide-react";
import {
  Chat,
  Channel,
  ChannelList,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";

import CustomChannelHeader from "../components/CustomChannelHeader";
import "../styles/stream-chat-theme.css"
import CreateChannelModal from "../components/CreateChannelModal";
import CustomerChannelPreview from "../components/CustomerChannelPreview";
import UsersList from "../components/UsersList";




const HomePage = () => {

  const  [ isCreatingModalOpen, setIsCreatingModalOpen ] = useState();
  const  [ activeChannel, setActiveChannel ]  = useState();
  const [ searchParams, setSearchParams ] = useSearchParams();
  const { chatClient, error, isLoading } = useStreamChat()


  // Set actice channel from the URL params
  useEffect(() => {
    if (chatClient) {
      const channelId = searchParams.get("channel")

      if (channelId) {
        const channel = chatClient.channel("messaging", channelId)
        setActiveChannel(channel)
      }
    }
  }, [chatClient, searchParams])


  if (error) return <p>Something went wrong...</p> 
  if (isLoading || !chatClient) return <PageLoader />

  return (
    <div className="chat-wrapper">
      <Chat client={chatClient}>

        <div className="chat-container">
          {/* Left Sidebar */}
          <div className="str-chat__channel-list">
            <div className="team-channel-list">
              {/* Haeder */}
              <div className="team-channel-list__header gap-4">
                <div className="brand-container">
                  <img src="/slack-logo.png" alt="Logo" className="brand-logo"/>
                  <span className="brand-name">Slack</span>
                </div>
                <div className="user-button-wrapper">
                  <UserButton />
                </div>
              </div>

              {/* Channels List */}
              <div className="team-channel-list__content">
                <div className="create-channel-section">
                  <button onClick={() => setIsCreatingModalOpen(true)} className="create-channel-btn">
                    <PlusIcon className="size-4"/>
                    <span>Create Channel</span>
                  </button>
                </div>
                {/* Channel List */}

                <ChannelList 
                  filters={{members:{$in: [chatClient?.user.id]}}}
                  options={{state: true, watch: true}}
                  Preview={({channel}) => (
                    <CustomerChannelPreview 
                      channel={channel}
                      activeChannel={activeChannel}
                      setActiveChannel={(channel) => setSearchParams({channel: channel.id})}
                    />
                  )}
                  List = {({children, error, loading}) => (
                    <div className="channel-sections">
                      <div className="section-header">
                        <div className="section-title">
                          <HashIcon className="size-4"/>
                          <span>Channels</span>
                        </div>
                      </div>

                      {loading && <div className="loading-message">Loading Channels...</div>}
                      {error && <div className="error-message">Error loading channels</div>}

                      <div className="channels-list">
                        {children}

                        <div className="section-header direct-messages">
                          <div className="section-title">
                            <UserIcon className="size-4" />
                            <span>Direct Messages</span>
                          </div>
                        </div>
                        <UsersList activeChannel={activeChannel}/>
                      </div>

                    </div>
                  )}
                />

              </div>
            </div>
          </div>

          {/* Right container */}
            <div className="chat-main">
              <Channel channel={activeChannel}>
                <Window>
                  <CustomChannelHeader />
                  <MessageList />
                  <MessageInput />
                </Window>
                <Thread />
              </Channel>
            </div>
        </div>

        {isCreatingModalOpen && (
          <CreateChannelModal 
            onClose={() => setIsCreatingModalOpen(false)}
          />
        )}

      </Chat>
    </div>
  );
};

export default HomePage;
