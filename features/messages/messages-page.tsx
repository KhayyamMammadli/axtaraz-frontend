"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowLeft, CheckCheck, ChevronDown, Filter, Heart, Image as ImageIcon,
  MessageCircle, MoreVertical, Paperclip, Search, Send, Smile, X,
} from "lucide-react";
import styles from "./messages.module.css";

type Message = { id: number; text: string; time: string; mine: boolean };
type Conversation = {
  id: number;
  title: string;
  image: string;
  listingTitle: string;
  listingPrice: string;
  listingImage: string;
  listingHref: string;
  preview: string;
  date: string;
  person: string;
  type: "ad" | "business";
  isMine: boolean;
  interested: boolean;
  unread: boolean;
  favorite: boolean;
  messages: Message[];
};

const defaultAvatar = "https://api.axtar.az/img/user/default.png";
const conversationsSeed: Conversation[] = [
  {
    id: 1, title: "laptop mac", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=240&q=80",
    listingTitle: "laptop mac", listingPrice: "32423 ₼", listingImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=300&q=80",
    listingHref: "/product/laqbaum-055-245-89-79-101", preview: "Salam", date: "1 ay əvvəl", person: "Tural",
    type: "ad", isMine: true, interested: true, unread: false, favorite: true,
    messages: [
      { id: 1, text: "werwer", time: "4 ay əvvəl", mine: false },
      { id: 2, text: "124", time: "3 ay əvvəl", mine: true },
      { id: 3, text: "2345", time: "2 ay əvvəl", mine: true },
      { id: 4, text: "Salam", time: "1 ay əvvəl", mine: true },
    ],
  },
  {
    id: 2, title: "ps 4", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=240&q=80",
    listingTitle: "ps 4", listingPrice: "650 ₼", listingImage: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=300&q=80",
    listingHref: "/full-search?title=PlayStation", preview: "123456", date: "4 həftə əvvəl", person: "Orxan",
    type: "ad", isMine: false, interested: false, unread: true, favorite: false,
    messages: [{ id: 1, text: "123456", time: "4 həftə əvvəl", mine: true }],
  },
  {
    id: 3, title: "Haval H6", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=240&q=80",
    listingTitle: "Haval H6", listingPrice: "42 000 ₼", listingImage: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=300&q=80",
    listingHref: "/full-search?title=Haval", preview: "yrufyh", date: "3 ay əvvəl", person: "Elvin",
    type: "ad", isMine: true, interested: true, unread: false, favorite: false,
    messages: [{ id: 1, text: "yrufyh", time: "3 ay əvvəl", mine: false }],
  },
  {
    id: 4, title: "iPhone 15 Pro", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=240&q=80",
    listingTitle: "iPhone 15 Pro", listingPrice: "1 850 ₼", listingImage: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=300&q=80",
    listingHref: "/full-search?title=iPhone", preview: "Son qiymət nə olar?", date: "2 həftə əvvəl", person: "Aysel",
    type: "ad", isMine: false, interested: false, unread: true, favorite: false,
    messages: [{ id: 1, text: "Son qiymət nə olar?", time: "2 həftə əvvəl", mine: false }],
  },
  {
    id: 5, title: "Kia Sportage", image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=240&q=80",
    listingTitle: "Kia Sportage", listingPrice: "31 000 ₼", listingImage: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=300&q=80",
    listingHref: "/full-search?title=Kia", preview: "Maşın hələ satılmayıb?", date: "1 həftə əvvəl", person: "Rauf",
    type: "ad", isMine: true, interested: false, unread: false, favorite: true,
    messages: [{ id: 1, text: "Maşın hələ satılmayıb?", time: "1 həftə əvvəl", mine: false }],
  },
  {
    id: 6, title: "Tural Market", image: defaultAvatar,
    listingTitle: "Tural Market", listingPrice: "", listingImage: "", listingHref: "/ownerships",
    preview: "Ətraflı məlumat göndərin.", date: "Dünən", person: "Tural Market",
    type: "business", isMine: false, interested: true, unread: false, favorite: false,
    messages: [{ id: 1, text: "Ətraflı məlumat göndərin.", time: "Dünən", mine: false }],
  },
];

type Tab = "all" | "mine" | "interested";
type FilterDraft = { type: "all" | "ad" | "business"; unread: boolean; favorite: boolean; sort: "newest" | "oldest" };
const defaultFilters: FilterDraft = { type: "all", unread: false, favorite: false, sort: "newest" };

export function MessagesPage() {
  const [conversations, setConversations] = useState(conversationsSeed);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  const [draftFilters, setDraftFilters] = useState(defaultFilters);
  const [menuOpen, setMenuOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const visibleConversations = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("az");
    return conversations
      .filter((item) => {
        const tabMatches =
          activeTab === "all" ||
          (activeTab === "mine" && item.isMine) ||
          (activeTab === "interested" && item.interested);
        const typeMatches = filters.type === "all" || item.type === filters.type;
        const statusMatches = (!filters.unread || item.unread) && (!filters.favorite || item.favorite);
        const searchMatches = !normalizedSearch ||
          item.title.toLocaleLowerCase("az").includes(normalizedSearch) ||
          item.preview.toLocaleLowerCase("az").includes(normalizedSearch);
        return tabMatches && typeMatches && statusMatches && searchMatches;
      })
      .sort((a, b) => filters.sort === "newest" ? a.id - b.id : b.id - a.id);
  }, [activeTab, conversations, filters, search]);

  const selectedConversation = conversations.find((item) => item.id === selectedId) ?? null;

  function openFilter() {
    setDraftFilters(filters);
    setFilterOpen(true);
  }

  function applyFilter() {
    setFilters(draftFilters);
    setFilterOpen(false);
  }

  function sendMessage() {
    const text = messageText.trim() || attachmentName;
    if (!text || selectedId === null) return;
    setConversations((current) => current.map((item) => item.id !== selectedId ? item : {
      ...item,
      preview: text,
      date: "İndi",
      unread: false,
      messages: [...item.messages, { id: Date.now(), text, time: "İndi", mine: true }],
    }));
    setMessageText("");
    setAttachmentName("");
  }

  function onMessageKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function deleteConversation() {
    if (selectedId === null) return;
    setConversations((current) => current.filter((item) => item.id !== selectedId));
    setSelectedId(null);
    setMenuOpen(false);
  }

  return (
    <section className={styles.messagesPage} aria-label="Mesajlar">
      <div className={`${styles.layout} ${selectedId !== null ? styles.hasActive : ""}`}>
        <aside className={styles.listPanel}>
          <h1 className={styles.pageTitle}>Mesajlar</h1>
          <div className={styles.tabs} role="tablist" aria-label="Söhbət filtrləri">
            <button className={activeTab === "all" ? styles.activeTab : ""} onClick={() => setActiveTab("all")} role="tab" aria-selected={activeTab === "all"}>Hamısı</button>
            <button className={activeTab === "mine" ? styles.activeTab : ""} onClick={() => setActiveTab("mine")} role="tab" aria-selected={activeTab === "mine"}>Mənimkilər</button>
            <button className={activeTab === "interested" ? styles.activeTab : ""} onClick={() => setActiveTab("interested")} role="tab" aria-selected={activeTab === "interested"}>Maraqlandıqlarım</button>
          </div>
          <div className={styles.searchRow}>
            <label className={styles.searchBox}>
              <Search size={22} aria-hidden="true" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Söhbətlərdə axtar..." aria-label="Söhbətlərdə axtar" />
            </label>
            <button type="button" className={styles.filterButton} onClick={openFilter} aria-label="Söhbətləri filtrlə"><Filter size={26} /></button>
          </div>
          <div className={styles.conversationList}>
            {visibleConversations.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`${styles.conversation} ${selectedId === item.id ? styles.selectedConversation : ""}`}
                onClick={() => { setSelectedId(item.id); setMenuOpen(false); setConversations((current) => current.map((conversation) => conversation.id === item.id ? { ...conversation, unread: false } : conversation)); }}
              >
                <img className={styles.conversationImage} src={item.image} alt="" />
                <span className={styles.conversationDetails}>
                  <span className={styles.conversationTop}><strong>{item.title}</strong><time>{item.date}</time></span>
                  <span className={styles.conversationListing}>{item.type === "business" ? "Biznes" : "Elan"} · Xeyyam Memmedli</span>
                  <span className={styles.conversationPreview}>{item.preview}</span>
                </span>
                {item.unread && <span className={styles.unreadDot} aria-label="Oxunmamış" />}
              </button>
            ))}
            {!visibleConversations.length && <p className={styles.noConversations}>Söhbət tapılmadı</p>}
          </div>
          <div className={styles.conversationCount}>Söhbətlərin sayı: {visibleConversations.length}</div>
        </aside>

        <section className={styles.chatPanel} aria-label={selectedConversation ? `Söhbət: ${selectedConversation.title}` : "Söhbət pəncərəsi"}>
          {selectedConversation ? (
            <>
              <header className={styles.chatHeader}>
                <button type="button" className={styles.backButton} onClick={() => setSelectedId(null)} aria-label="Söhbət siyahısına qayıt"><ArrowLeft size={21} /></button>
                <img src={defaultAvatar} className={styles.personAvatar} alt="" />
                <strong>{selectedConversation.person}</strong>
                <div className={styles.menuWrap}>
                  <button type="button" className={styles.moreButton} aria-label="Söhbət seçimləri" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><MoreVertical size={24} /></button>
                  {menuOpen && <div className={styles.chatMenu}><a href={selectedConversation.listingHref}>Elana bax</a><button type="button" onClick={deleteConversation}>Söhbəti sil</button></div>}
                </div>
              </header>

              {selectedConversation.listingTitle && (
                <a href={selectedConversation.listingHref} className={styles.listingCard}>
                  <img src={selectedConversation.listingImage} alt="" />
                  <span className={styles.listingInfo}>
                    {selectedConversation.listingPrice && <strong>{selectedConversation.listingPrice}</strong>}
                    <b>{selectedConversation.listingTitle}</b>
                  </span>
                  <span className={styles.listingLink}>Elana bax <ChevronDown size={18} /></span>
                </a>
              )}

              <div className={styles.chatMessages}>
                {selectedConversation.messages.map((item, index) => (
                  <div key={item.id} className={styles.messageGroup}>
                    {index === 0 && <time className={styles.dayLabel}>{item.time}</time>}
                    <div className={item.mine ? styles.outgoingRow : styles.incomingRow}>
                      {!item.mine && <img src={defaultAvatar} alt="" className={styles.messageAvatar} />}
                      <div className={item.mine ? styles.outgoingBubble : styles.incomingBubble}>
                        <span>{item.text}</span>
                        <small>{item.time}{item.mine && <CheckCheck size={16} aria-label="Oxunub" />}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.composer}>
                <input
                  ref={fileInput}
                  type="file"
                  className={styles.hiddenFile}
                  onChange={(event) => setAttachmentName(event.target.files?.[0]?.name || "")}
                  aria-label="Fayl əlavə et"
                />
                <button type="button" className={styles.attachButton} onClick={() => fileInput.current?.click()} aria-label="Fayl əlavə et"><Paperclip size={25} /></button>
                <div className={styles.messageInputWrap}>
                  {attachmentName && <span className={styles.attachmentChip}><ImageIcon size={15} />{attachmentName}<button type="button" onClick={() => setAttachmentName("")} aria-label="Faylı sil"><X size={14} /></button></span>}
                  <input value={messageText} onChange={(event) => setMessageText(event.target.value)} onKeyDown={onMessageKeyDown} placeholder="Mesaj yazın..." aria-label="Mesaj yazın" />
                  <button type="button" className={styles.emojiButton} onClick={() => setMessageText((value) => `${value}🙂`)} aria-label="Emoji əlavə et"><Smile size={23} /></button>
                </div>
                <button type="button" className={styles.sendButton} onClick={sendMessage} aria-label="Mesajı göndər"><Send size={25} fill="currentColor" /></button>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}><MessageCircle size={73} fill="currentColor" /><MessageCircle size={73} fill="currentColor" /></div>
              <h2>Mesajlar</h2>
              <p>Söhbətə başlamaq üçün soldan bir<br className={styles.desktopBreak} /> yazışma seçin.</p>
            </div>
          )}
        </section>
      </div>

      {filterOpen && (
        <div className={styles.filterBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setFilterOpen(false); }}>
          <aside className={styles.filterDrawer} role="dialog" aria-modal="true" aria-label="Mesaj filtri">
            <header className={styles.filterHeader}>
              <h2>Filtr</h2>
              <div><button type="button" className={styles.resetButton} onClick={() => setDraftFilters(defaultFilters)}>Sıfırla</button><button type="button" className={styles.closeFilter} onClick={() => setFilterOpen(false)} aria-label="Filtri bağla"><X size={22} /></button></div>
            </header>

            <section className={styles.filterGroup}>
              <h3>Növ</h3>
              <div className={styles.choiceGrid}>
                {([["all","Hamısı"],["ad","Elanlar"],["business","Bizneslər"]] as const).map(([value,label]) => (
                  <label key={value} className={draftFilters.type === value ? styles.choiceSelected : ""}>
                    <input type="radio" name="message-type" checked={draftFilters.type === value} onChange={() => setDraftFilters((current) => ({ ...current, type: value }))} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className={styles.filterGroup}>
              <h3>Status</h3>
              <div className={styles.choiceGrid}>
                <label className={draftFilters.unread ? styles.choiceSelected : ""}>
                  <input type="checkbox" checked={draftFilters.unread} onChange={(event) => setDraftFilters((current) => ({ ...current, unread: event.target.checked }))} />
                  <span>Oxunmamış</span>
                </label>
                <label className={draftFilters.favorite ? styles.choiceSelected : ""}>
                  <input type="checkbox" checked={draftFilters.favorite} onChange={(event) => setDraftFilters((current) => ({ ...current, favorite: event.target.checked }))} />
                  <Heart size={17} />
                  <span>Seçilmişlər</span>
                </label>
              </div>
            </section>

            <section className={styles.filterGroup}>
              <h3>Sıralama</h3>
              <div className={styles.choiceGrid}>
                {([["newest","Ən yeni"],["oldest","Ən köhnə"]] as const).map(([value,label]) => (
                  <label key={value} className={draftFilters.sort === value ? styles.choiceSelected : ""}>
                    <input type="radio" name="message-sort" checked={draftFilters.sort === value} onChange={() => setDraftFilters((current) => ({ ...current, sort: value }))} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </section>

            <button type="button" className={styles.showResults} onClick={applyFilter}>Nəticələri göstər</button>
          </aside>
        </div>
      )}
    </section>
  );
}
