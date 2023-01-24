import React from "react";
import NavFeed from "./NavFeed";
import Search from "./Search";
import SearchBookmark from "./SearchBookmark";

const BookmarkNav = () => {
  return (
    <NavFeed title="Bookmark">
      <div className="p-2">
        <SearchBookmark placeholder="Search Bookmark" />
      </div>
    </NavFeed>
  );
};

export default BookmarkNav;
