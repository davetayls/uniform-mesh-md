import React, { useEffect, useState } from "react";
import {
  EntrySearch,

  useUniformMeshLocation,
} from "@uniformdev/mesh-sdk-react";

import { LoadingIndicator } from "@uniformdev/design-system";

function toResult(file) {
  const { id, title, owner, repo, metadata } = file;
  return {
    id,
    title,
    metadata,
    editLink: `https://github.com/${owner}/${repo}/edit/main/${id}`,
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

export default function MdParameterEditor() {
  const { value, setValue, metadata } = useUniformMeshLocation();
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchText, setSearchText] = useState(null);

  useEffect(() => {
    console.log('Search text effect:', JSON.stringify(searchText))
    async function getFiles() {
      if (!metadata.settings) return
      setLoading(true)
      const { owner, repo, path, token } = metadata.settings
      console.log('Fetching search results')
      const data = await fetch(
        `/api/${owner}/${repo}/${path.replace(/^\//, '')}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const res = await data.json();
      setFiles(res)
      setLoading(false);
    }

    getFiles();
  }, []);

  useEffect(() => {
    if (value?.id) {
      const selected = results.filter((result) => result.id == value.id);

      if (selected && selected.length > 0) {
        setSelectedItems(selected);
        return;
      }
    }
    setSelectedItems();
  }, [value]);

  useEffect(() => {
    const results = getSearchResults(searchText, files);
    setResults(results);

    if (value?.id) {
      const selected = results.filter((result) => result.id == value.id);
      setSelectedItems(selected);
    }
  }, [searchText, files]);

  const onSearch = (text) => {
    console.log('onSearch', text)
    setSearchText(text);
  };

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
          resultsLoading={loading}
          results={results}
          search={onSearch}
          select={onSelect}
          selectedItems={selectedItems}
        />
      )}
    </div>
  );
}
