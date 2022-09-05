import React, { useEffect, useState } from "react";
import {
  useUniformMeshLocation,
  Button,
  Input,
  LoadingOverlay,
  Callout,
  Heading,
} from "@uniformdev/mesh-sdk-react";

export default function Settings() {
  const { value, setValue } = useUniformMeshLocation();

  const handleSettingsChange = async (settings) => {
    await setValue(settings);
  };

  return (
    <>
      <Heading level={2}>Github settings</Heading>
      <p>
        These settings are used to be able to select Markdown files from your
        repository
      </p>
      <SettingsInner settings={value} onSettingsChange={handleSettingsChange} />
    </>
  );
}

const SettingsInner = ({ settings, onSettingsChange }) => {
  const [formState, setFormState] = useState({
    owner: "",
    repo: "",
    path: "",
    token: "",
    isSubmitting: false,
    saveSuccess: false,
  });
  const [error, setError] = useState();

  useEffect(() => {
    setFormState((prev) => {
      return {
        ...prev,
        owner: settings?.owner || "",
        repo: settings?.repo || "",
        path: settings?.path || "",
        token: settings?.token || "",
      };
    });
  }, [settings]);

  const handleInputChange = (e) => {
    setFormState((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
        saveSuccess: false,
      };
    });
  };

  const handleSubmit = async () => {
    if (!formState.owner || !formState.repo || !formState.path) {
      setError(new Error("Be sure to provide a owner, repo and a path"));
      return;
    }

    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
      saveSuccess: false,
    }));

    try {
      await onSettingsChange({
        owner: formState.owner,
        repo: formState.repo,
        path: formState.path,
        token: formState.token,
      });

      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        saveSuccess: true,
      }));
    } catch (err) {
      setError(err);
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        saveSuccess: false,
      }));
    }
  };

  return (
    <div className="container-with-vertical-padding">
      <LoadingOverlay isActive={formState.isSubmitting} />
      {error ? <Callout type="error">{error.message}</Callout> : null}
      {formState.saveSuccess ? (
        <Callout type="success">Settings were saved successfully</Callout>
      ) : null}

      <div className="container-with-vertical-padding">
        <Input
          name="owner"
          id="owner"
          label="ownername"
          placeholder="vercel"
          onChange={handleInputChange}
          value={formState.owner}
          caption="The github ownername that is part of the repository identifier."
        />
      </div>
      <div className="container-with-vertical-padding">
        <Input
          id="repo"
          name="repo"
          label="Repository"
          placeholder="next.js"
          onChange={handleInputChange}
          value={formState.repo}
        />
      </div>
      <div className="container-with-vertical-padding">
        <Input
          id="path"
          name="path"
          label="File path"
          placeholder="/content"
          onChange={handleInputChange}
          value={formState.path}
        />
      </div>
      <div className="container-with-vertical-padding">
        <Input
          id="token"
          name="token"
          label="Personal Access Token"
          type="password"
          placeholder="ghp_???"
          onChange={handleInputChange}
          value={formState.token}
        />
      </div>

      <div className="container-with-vertical-padding">
        <Button
          type="button"
          buttonType="secondary"
          size="xl"
          onClick={handleSubmit}
          disabled={formState.isSubmitting}
        >
          Save
        </Button>
      </div>
    </div>
  );
};
