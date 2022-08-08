import React, { useEffect, useState } from "react";
import {
  EntrySearch,
  useUniformMeshLocation,
} from "@uniformdev/mesh-sdk-react";

import { LoadingIndicator } from "@uniformdev/design-system";

function toResult(file) {
  const { id, title } = file;
  return {
    id,
    title,
    //editLink: `https://github.com/${metadata.settings?.owner}/${metadata.settings?.repo}/blob/main/${metadata.settings?.path}/${id}`,
  };
}

function getSearchResults(filter, files) {
  if (!files) {
    return [];
  }

  if (!filter) {
    return files.map(toResult);
  }

  const regex = new RegExp(filter, "i");
  const filtered = files.filter((file) => {
    return file.title.match(regex);
  });

  return filtered.map(toResult);
}

export default function PrintfulParameterEditor() {
  const { value, setValue, metadata } = useUniformMeshLocation();
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchText, setSearchText] = useState();

  useEffect(() => {
    async function getFiles() {
      const data = await fetch(
        `/api/read-files/?owner=${metadata.settings?.owner}&repo=${metadata.settings?.repo}&path=${metadata.settings?.path}`
      );

      const res = await data.json();
      setFiles(res);

      const results = getSearchResults(searchText, files);
      setResults(results);

      if (value?.id) {
        const selected = results.filter((result) => result.id == value.id);
        setSelectedItems(selected);
      }
      setLoading(false);
    }

    getFiles();
  }, [searchText, files]);

  useEffect(() => {
    if (value?.id) {
      const selected = results.filter((result) => result.id == value.id);

      if (selected && selected.length > 0) {
        setSelectedItems(selected);
        return;
      }
    }
    setSelectedItems();
  }, [value, results]);

  useEffect(() => {
    const results = getSearchResults(searchText, files);
    setResults(results);
  }, [searchText, files]);

  const onSearch = (text) => setSearchText(text);

  const onSelect = (selected) => {
    if (selected && selected.length == 1) {
      setValue({ id: selected[0].id });
    } else {
      setValue("");
    }
  };

  return (
    <div>
      {loading && <LoadingIndicator />}
      {!loading && (
        <EntrySearch
          logoIcon="https://www.iconbolt.com/download/format:svg/plain/remix-icon-fill/markdown.svg"
          multiSelect={false}
          results={results}
          search={onSearch}
          select={onSelect}
          selectedItems={selectedItems}
        />
      )}
    </div>
  );
}
