import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface MediaItem {
  id: number;
  src: string;
  title: string;
  author: string;
  tags: string[];
  category: string;
  type: "photo" | "video";
  comments: Comment[];
}

interface Comment {
  id: number;
  author: string;
  text: string;
  time: string;
}

const DEMO_MEDIA: MediaItem[] = [
  {
    id: 1,
    src: "https://cdn.poehali.dev/projects/14a45a47-a919-4f44-a2f5-165a9913e716/files/81e1ee10-ca19-42c2-b273-b4fa2809ef40.jpg",
    title: "Абстракция в неоне",
    author: "Аня К.",
    tags: ["арт", "неон", "абстракция"],
    category: "Искусство",
    type: "photo",
    comments: [
      { id: 1, author: "Макс", text: "Огненная работа! 🔥", time: "2ч назад" },
      { id: 2, author: "Лена", text: "Какие цвета, обалдеть", time: "1ч назад" },
    ],
  },
  {
    id: 2,
    src: "https://cdn.poehali.dev/projects/14a45a47-a919-4f44-a2f5-165a9913e716/files/0e6de287-b431-4044-a7c9-a5507c005560.jpg",
    title: "Закат на побережье",
    author: "Дима Р.",
    tags: ["природа", "закат", "океан"],
    category: "Природа",
    type: "photo",
    comments: [
      { id: 3, author: "Саша", text: "Хочу туда!", time: "30мин назад" },
    ],
  },
  {
    id: 3,
    src: "https://cdn.poehali.dev/projects/14a45a47-a919-4f44-a2f5-165a9913e716/files/65d2a46f-5c44-4373-8310-de926ed06e5c.jpg",
    title: "Ночной город",
    author: "Олег М.",
    tags: ["город", "ночь", "киберпанк"],
    category: "Город",
    type: "photo",
    comments: [],
  },
];

const CATEGORIES = ["Все", "Искусство", "Природа", "Город", "Люди", "Еда"];

const Index = () => {
  const [activeTab, setActiveTab] = useState<"gallery" | "upload">("gallery");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [newComment, setNewComment] = useState("");
  const [media, setMedia] = useState<MediaItem[]>(DEMO_MEDIA);
  const [dragOver, setDragOver] = useState(false);

  const filtered = media.filter((item) => {
    const matchCategory =
      activeCategory === "Все" || item.category === activeCategory;
    const matchSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      item.author.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const addComment = () => {
    if (!newComment.trim() || !selectedMedia) return;
    const updated = media.map((m) =>
      m.id === selectedMedia.id
        ? {
            ...m,
            comments: [
              ...m.comments,
              {
                id: Date.now(),
                author: "Вы",
                text: newComment,
                time: "только что",
              },
            ],
          }
        : m
    );
    setMedia(updated);
    setSelectedMedia(
      updated.find((m) => m.id === selectedMedia.id) || null
    );
    setNewComment("");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-gradient">студенты</span>
            <span className="text-muted-foreground font-light">.паб</span>
          </h1>

          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === "gallery" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("gallery")}
              className={activeTab === "gallery" ? "glow-purple" : ""}
            >
              <Icon name="LayoutGrid" size={16} />
              <span className="hidden sm:inline ml-2">Галерея</span>
            </Button>
            <Button
              variant={activeTab === "upload" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("upload")}
              className={activeTab === "upload" ? "glow-purple" : ""}
            >
              <Icon name="Upload" size={16} />
              <span className="hidden sm:inline ml-2">Загрузка</span>
            </Button>
          </div>
        </div>
      </header>

      {activeTab === "gallery" && (
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Icon
                name="Search"
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Поиск по тегам, авторам..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card border-border/50 focus:glow-purple"
              />
            </div>
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
            {CATEGORIES.map((cat) => (
              <Badge
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                className={`cursor-pointer shrink-0 transition-all hover:scale-105 ${
                  activeCategory === cat
                    ? "glow-purple bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-muted-foreground text-lg">
                Ничего не найдено
              </p>
              <p className="text-muted-foreground/60 text-sm mt-1">
                Попробуй другой запрос или категорию
              </p>
            </div>
          ) : (
            <div className="masonry">
              {filtered.map((item, i) => (
                <div
                  key={item.id}
                  className="group relative rounded-xl overflow-hidden bg-card border border-border/30 hover-lift cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                  onClick={() => setSelectedMedia(item)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                          <Icon name="Play" size={20} className="text-white ml-0.5" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white font-semibold text-sm">
                        {item.title}
                      </p>
                      <p className="text-white/70 text-xs">{item.author}</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{item.title}</span>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Icon name="MessageCircle" size={14} />
                        <span className="text-xs">{item.comments.length}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {activeTab === "upload" && (
        <main className="max-w-2xl mx-auto px-4 py-12 animate-fade-in">
          <h2 className="text-3xl font-bold mb-2">
            <span className="text-gradient">Загрузи</span> свой контент
          </h2>
          <p className="text-muted-foreground mb-8">
            Поделись творчеством с сообществом
          </p>

          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
              dragOver
                ? "border-primary bg-primary/10 glow-purple"
                : "border-border/50 hover:border-primary/50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
            }}
          >
            <div className="animate-float">
              <Icon
                name="CloudUpload"
                size={48}
                className="mx-auto mb-4 text-primary"
              />
            </div>
            <p className="text-lg font-medium mb-1">
              Перетащи файлы сюда
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              или нажми для выбора
            </p>
            <Button className="glow-purple">
              <Icon name="Plus" size={16} />
              <span className="ml-2">Выбрать файлы</span>
            </Button>
            <p className="text-muted-foreground/50 text-xs mt-4">
              JPG, PNG, GIF, MP4 — до 50MB
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <Input
              placeholder="Название"
              className="bg-card border-border/50"
            />
            <div className="flex gap-2">
              <Input
                placeholder="Теги через запятую"
                className="bg-card border-border/50 flex-1"
              />
              <select className="bg-card border border-border/50 rounded-lg px-3 text-sm text-foreground">
                {CATEGORIES.filter((c) => c !== "Все").map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <Button className="w-full glow-purple" size="lg">
              <Icon name="Rocket" size={18} />
              <span className="ml-2">Опубликовать</span>
            </Button>
          </div>
        </main>
      )}

      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="bg-card rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-border/30 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedMedia.src}
                alt={selectedMedia.title}
                className="w-full max-h-[50vh] object-cover"
              />
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <Icon name="X" size={16} className="text-white" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{selectedMedia.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {selectedMedia.author}
                  </p>
                </div>
                <div className="flex gap-1">
                  {selectedMedia.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="border-t border-border/30 pt-4">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Icon name="MessageCircle" size={16} />
                  Комментарии ({selectedMedia.comments.length})
                </h4>

                <div className="space-y-3 max-h-40 overflow-y-auto mb-4 scrollbar-hide">
                  {selectedMedia.comments.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      Пока нет комментариев. Будь первым!
                    </p>
                  ) : (
                    selectedMedia.comments.map((c) => (
                      <div
                        key={c.id}
                        className="flex gap-3 p-3 rounded-lg bg-secondary/50"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-white">
                            {c.author[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {c.author}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {c.time}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/80 mt-0.5">
                            {c.text}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <Textarea
                    placeholder="Написать комментарий..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="bg-secondary/50 border-border/30 min-h-[40px] max-h-24 resize-none text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        addComment();
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={addComment}
                    className="shrink-0 self-end glow-purple"
                  >
                    <Icon name="Send" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
