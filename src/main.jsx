import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ArticlePage from "./pages/ArticlePage";
import CharacterPage from "./components/CharacterPage";
import CharacterHub from "./pages/CharacterHub";
import CategoryHub from "./pages/CategoryHub";
import PollsHub from "./pages/PollsHub";
import CategoriesPage from "./pages/CategoriesPage";
import BookmarksPage from "./pages/BookmarksPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import SeriesDetailPage from "./pages/SeriesDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StorePage from "./pages/StorePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Home from "./App";
import { CartProvider } from "./context/CartProvider";
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />
            <Route path="/characters" element={<CharacterHub />} />
            <Route path="/characters/:slug" element={<CharacterPage />} />
            <Route path="/category/:category" element={<CategoryHub />} />
            <Route path="/polls" element={<PollsHub />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/series/:slug" element={<SeriesDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/store/:id" element={<StorePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
