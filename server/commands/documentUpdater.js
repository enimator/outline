// @flow
import { uniq } from "lodash";
import { Node } from "prosemirror-model";
import { schema, serializer } from "rich-markdown-editor";
import { yDocToProsemirrorJSON } from "y-prosemirror";
import * as Y from "yjs";
import { Document, Event } from "../models";

export default async function documentUpdater({
  documentId,
  ydoc,
  userId,
  done,
}: {
  documentId: string,
  ydoc: Y.Doc,
  userId?: string,
  done?: boolean,
}) {
  const document = await Document.findByPk(documentId);
  const state = Y.encodeStateAsUpdate(ydoc);
  const node = Node.fromJSON(schema, yDocToProsemirrorJSON(ydoc, "default"));
  const text = serializer.serialize(node);

  // extract collaborators from doc user data
  const pud = new Y.PermanentUserData(ydoc);
  const pudIds = Array.from(pud.clients.values());
  const existingIds = document.collaboratorIds;
  const collaboratorIds = uniq([...pudIds, ...existingIds]);
  const isUnchanged = document.text === text;
  const hasMultiplayerState = !!document.state;

  if (isUnchanged && hasMultiplayerState) {
    return;
  }

  await Document.scope("withUnpublished").update(
    {
      text,
      state: Buffer.from(state),
      updatedAt: isUnchanged ? document.updatedAt : new Date(),
      lastModifiedById: isUnchanged ? document.lastModifiedById : userId,
      collaboratorIds,
    },
    {
      hooks: false,
      where: {
        id: documentId,
      },
    }
  );

  await Event.add({
    name: "documents.update",
    documentId: document.id,
    collectionId: document.collectionId,
    teamId: document.teamId,
    actorId: userId,
    data: {
      multiplayer: true,
      title: document.title,
    },
  });
}
