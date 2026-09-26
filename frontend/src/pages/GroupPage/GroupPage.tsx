import { useState } from 'react'
import { useParams } from 'react-router'
import { useGetGroupQuery } from '~/api'
import {
  Button,
  Card,
  Disclosure,
  EmptyState,
  GroupHeader,
  Heading,
  Page,
  PromptButton,
  QueryStatus,
} from '~/components'
import { GroupPictureForm, MembershipButton, PostFeed, PostForm } from '~/features'
import { useCurrentUser, useFocusReturn, useMembership } from '~/hooks'

export const GroupPage = () => {
  const { groupId } = useParams()
  if (groupId === undefined) {
    throw new Error('GroupPage must be rendered on a route with a :groupId param')
  }

  const { data: group, isLoading, error } = useGetGroupQuery(groupId)
  const user = useCurrentUser()
  const { membership } = useMembership(groupId)
  const [isEditing, setIsEditing] = useState(false)
  const editButtonRef = useFocusReturn<HTMLButtonElement>(isEditing)

  const handleEdit = () => setIsEditing(true)
  const handleCloseEdit = () => setIsEditing(false)

  if (!group) {
    return <QueryStatus isLoading={isLoading} error={error} />
  }

  const groupTag = `#${group.name.toLowerCase()}`

  return (
    <Page>
      <GroupHeader
        group={group}
        actions={
          <>
            {membership && !isEditing && (
              <Button ref={editButtonRef} size="small" onClick={handleEdit}>
                edit group
              </Button>
            )}
            <MembershipButton groupId={group.id} />
          </>
        }
      />
      {membership && isEditing && (
        <Card as="section" variant="accent">
          <Heading level={2}>edit group</Heading>
          <GroupPictureForm
            groupId={group.id}
            onSuccess={handleCloseEdit}
            onCancel={handleCloseEdit}
          />
        </Card>
      )}
      {membership ? (
        <Disclosure
          label="new post"
          title={`post in ${groupTag}`}
          renderTrigger={(handleOpen) => (
            <PromptButton
              prompt={`post in ${groupTag}…`}
              actionLabel="POST"
              shortcutKey="n"
              onClick={handleOpen}
            />
          )}
        >
          {(handleClose) => (
            <PostForm groupId={group.id} onSuccess={handleClose} onCancel={handleClose} />
          )}
        </Disclosure>
      ) : (
        <EmptyState>
          {user ? `join ${groupTag} to post in it.` : `log in and join ${groupTag} to post in it.`}
        </EmptyState>
      )}
      <PostFeed filter={{ kind: 'group', groupId: group.id }} />
    </Page>
  )
}
