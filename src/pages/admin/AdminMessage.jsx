import { useCallback, useEffect, useState } from "react";
import {
  Mail,
  MailOpen,
  Trash2,
  Eye,
  EyeOff,
  CalendarDays,
  X,
  User,
  MessageSquare,
  RefreshCw,
} from "lucide-react";

import {
  getContactMessages,
  markContactMessageAsRead,
  markContactMessageAsUnread,
  deleteContactMessage,
} from "../../services/contactApi";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedMessage, setSelectedMessage] = useState(null);

  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchMessages = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setError("");

      const response = await getContactMessages();

      if (response.success) {
        setMessages(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch contact messages:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load messages"
      );
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadMessages = async () => {
      try {
        const response = await getContactMessages();

        if (isMounted && response.success) {
          setMessages(response.data || []);
        }
      } catch (error) {
        if (isMounted) {
          console.error(
            "Failed to fetch contact messages:",
            error
          );

          setError(
            error.response?.data?.message ||
              "Failed to load messages"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMessages();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenMessage = async (item) => {
    setSelectedMessage(item);

    if (!item.is_read) {
      try {
        setUpdatingId(item.id);

        await markContactMessageAsRead(item.id);

        setMessages((currentMessages) =>
          currentMessages.map((messageItem) =>
            messageItem.id === item.id
              ? { ...messageItem, is_read: true }
              : messageItem
          )
        );

        setSelectedMessage((currentMessage) =>
          currentMessage
            ? { ...currentMessage, is_read: true }
            : currentMessage
        );
      } catch (error) {
        console.error(
          "Failed to mark message as read:",
          error
        );
      } finally {
        setUpdatingId(null);
      }
    }
  };

  const handleToggleRead = async (item) => {
    try {
      setUpdatingId(item.id);
      setMessage("");
      setError("");

      if (item.is_read) {
        await markContactMessageAsUnread(item.id);

        setMessages((currentMessages) =>
          currentMessages.map((messageItem) =>
            messageItem.id === item.id
              ? { ...messageItem, is_read: false }
              : messageItem
          )
        );

        if (selectedMessage?.id === item.id) {
          setSelectedMessage((currentMessage) => ({
            ...currentMessage,
            is_read: false,
          }));
        }

        setMessage("Message marked as unread");
      } else {
        await markContactMessageAsRead(item.id);

        setMessages((currentMessages) =>
          currentMessages.map((messageItem) =>
            messageItem.id === item.id
              ? { ...messageItem, is_read: true }
              : messageItem
          )
        );

        if (selectedMessage?.id === item.id) {
          setSelectedMessage((currentMessage) => ({
            ...currentMessage,
            is_read: true,
          }));
        }

        setMessage("Message marked as read");
      }
    } catch (error) {
      console.error(
        "Failed to update message status:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update message status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingId(id);
      setMessage("");
      setError("");

      await deleteContactMessage(id);

      setMessages((currentMessages) =>
        currentMessages.filter(
          (messageItem) => messageItem.id !== id
        )
      );

      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }

      setMessage("Message deleted successfully");
    } catch (error) {
      console.error(
        "Failed to delete message:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete message"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown date";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = messages.filter(
    (item) => !item.is_read
  ).length;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <Mail className="h-5 w-5 text-purple-400" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold">
                  Messages
                </h1>

                <p className="mt-1 text-sm text-white/50">
                  Manage messages submitted through your portfolio.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fetchMessages(true)}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />

            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">
                  Total Messages
                </p>

                <p className="mt-2 text-3xl font-semibold">
                  {messages.length}
                </p>
              </div>

              <Mail className="h-6 w-6 text-white/40" />
            </div>
          </div>

          <div className="rounded-2xl border border-purple-400/20 bg-purple-400/[0.06] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-200/60">
                  Unread
                </p>

                <p className="mt-2 text-3xl font-semibold text-purple-300">
                  {unreadCount}
                </p>
              </div>

              <Mail className="h-6 w-6 text-purple-300/60" />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">
                  Read
                </p>

                <p className="mt-2 text-3xl font-semibold">
                  {messages.length - unreadCount}
                </p>
              </div>

              <MailOpen className="h-6 w-6 text-white/40" />
            </div>
          </div>
        </div>

        {/* Feedback */}
        {message && (
          <div className="mb-5 rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm text-green-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Messages */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-purple-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] px-6 text-center">
            <MessageSquare className="h-10 w-10 text-white/20" />

            <h2 className="mt-4 text-lg font-medium">
              No messages yet
            </h2>

            <p className="mt-2 max-w-md text-sm text-white/40">
              Messages submitted through your portfolio contact
              form will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((item) => (
              <article
                key={item.id}
                className={`rounded-2xl border p-4 transition sm:p-5 ${
                  item.is_read
                    ? "border-white/10 bg-white/[0.02]"
                    : "border-purple-400/20 bg-purple-400/[0.05]"
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Message info */}
                  <button
                    type="button"
                    onClick={() => handleOpenMessage(item)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
                        <User className="h-4 w-4 text-white/50" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate font-medium text-white">
                            {item.name}
                          </h3>

                          {!item.is_read && (
                            <span className="rounded-full bg-purple-400/15 px-2 py-0.5 text-[11px] font-medium text-purple-300">
                              Unread
                            </span>
                          )}
                        </div>

                        <p className="mt-1 truncate text-sm text-white/50">
                          {item.email}
                        </p>

                        {item.subject && (
                          <p className="mt-2 truncate text-sm font-medium text-white/80">
                            {item.subject}
                          </p>
                        )}

                        <p className="mt-1 line-clamp-2 text-sm text-white/40">
                          {item.message}
                        </p>

                        <div className="mt-3 flex items-center gap-2 text-xs text-white/30">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDate(item.created_at)}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2 border-t border-white/10 pt-3 lg:border-t-0 lg:pt-0">
                    <button
                      type="button"
                      onClick={() => handleOpenMessage(item)}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleRead(item)}
                      disabled={updatingId === item.id}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/70 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {item.is_read ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Unread
                        </>
                      ) : (
                        <>
                          <MailOpen className="h-4 w-4" />
                          Read
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="inline-flex items-center justify-center rounded-lg border border-red-400/20 bg-red-400/5 p-2 text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                      title="Delete message"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Message modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-2xl">
            {/* Modal header */}
            <div className="flex items-start justify-between border-b border-white/10 px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-400" />

                  <h2 className="text-lg font-semibold">
                    Message Details
                  </h2>
                </div>

                <p className="mt-1 text-xs text-white/40">
                  {formatDate(selectedMessage.created_at)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="rounded-lg p-2 text-white/50 transition hover:bg-white/[0.06] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal content */}
            <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-5 sm:p-6">
              <div className="space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/30">
                    From
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedMessage.name}
                  </p>

                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="mt-1 block text-sm text-purple-300 hover:text-purple-200"
                  >
                    {selectedMessage.email}
                  </a>
                </div>

                {selectedMessage.subject && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/30">
                      Subject
                    </p>

                    <p className="mt-1 font-medium text-white/90">
                      {selectedMessage.subject}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs uppercase tracking-wider text-white/30">
                    Message
                  </p>

                  <div className="mt-2 whitespace-pre-wrap rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-white/70">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleToggleRead(selectedMessage)
                    }
                    disabled={updatingId === selectedMessage.id}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.08] disabled:opacity-50"
                  >
                    {selectedMessage.is_read ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Mark as unread
                      </>
                    ) : (
                      <>
                        <MailOpen className="h-4 w-4" />
                        Mark as read
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-400"
                  >
                    <Mail className="h-4 w-4" />
                    Reply by Email
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(selectedMessage.id)
                    }
                    disabled={deletingId === selectedMessage.id}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminMessages;
