# Forum Database Schema Documentation

This document outlines the Firebase Realtime Database schema for the forum functionality, including the likes and reports system.

## Database Structure

### Forum Topics
**Path:** `forumTopics/{topicId}`

```json
{
  "topicId": {
    "title": "string",
    "content": "string",
    "author": "string",
    "authorId": "string",
    "authorAvatar": "string",
    "category": "string",
    "tags": ["string"],
    "likes": "number",
    "views": "number",
    "replyCount": "number",
    "createdAt": "timestamp",
    "lastActivity": "timestamp",
    "isSticky": "boolean",
    "isLocked": "boolean",
    "replies": {
      "replyId": {
        "author": "string",
        "authorId": "string",
        "authorAvatar": "string",
        "content": "string",
        "likes": "number",
        "createdAt": "timestamp",
        "lastModified": "timestamp"
      }
    }
  }
}
```

### User Likes Tracking
**Path:** `userLikes/{userId}`

```json
{
  "userId": {
    "topics": {
      "topicId": "timestamp"
    },
    "replies": {
      "replyId": "timestamp"
    }
  }
}
```

### Reports System
**Path:** `reports/{reportId}`

```json
{
  "reportId": {
    "reporterId": "string",
    "reporterName": "string",
    "contentType": "topic | reply",
    "contentId": "string",
    "topicId": "string",
    "reason": "string",
    "description": "string",
    "status": "pending | reviewed | resolved",
    "createdAt": "timestamp",
    "reviewedAt": "timestamp",
    "reviewedBy": "string",
    "action": "none | warning | removal | ban"
  }
}
```

### User Reports Tracking
**Path:** `userReports/{userId}`

```json
{
  "userId": {
    "topics": {
      "topicId": "timestamp"
    },
    "replies": {
      "replyId": "timestamp"
    }
  }
}
```

## Key Features Implemented

### 1. Like System
- **Topic Likes**: Users can like forum topics
- **Reply Likes**: Users can like individual replies
- **Duplicate Prevention**: Users cannot like the same content multiple times
- **Real-time Updates**: Like counts update immediately across all clients
- **User Tracking**: System tracks which users have liked which content

### 2. Report System
- **Content Reporting**: Users can report inappropriate topics and replies
- **Duplicate Prevention**: Users cannot report the same content multiple times
- **Admin Moderation**: Reports are stored for admin review
- **Status Tracking**: Reports have pending, reviewed, and resolved states
- **Action Logging**: Admin actions on reports are tracked

### 3. Real-time Synchronization
- **Live Updates**: All forum data updates in real-time using Firebase listeners
- **Optimistic Updates**: UI updates immediately for better user experience
- **Conflict Resolution**: Firebase handles concurrent updates automatically

## Database Rules Considerations

### Security Rules (Recommended)
```json
{
  "rules": {
    "forumTopics": {
      ".read": true,
      "$topicId": {
        ".write": "auth != null",
        "likes": {
          ".write": "auth != null"
        },
        "views": {
          ".write": true
        },
        "replies": {
          "$replyId": {
            ".write": "auth != null && (!data.exists() || data.child('authorId').val() == auth.uid)"
          }
        }
      }
    },
    "userLikes": {
      "$userId": {
        ".read": "auth != null && auth.uid == $userId",
        ".write": "auth != null && auth.uid == $userId"
      }
    },
    "reports": {
      ".read": "auth != null && root.child('users').child(auth.uid).child('role').val() == 'admin'",
      ".write": "auth != null"
    },
    "userReports": {
      "$userId": {
        ".read": "auth != null && auth.uid == $userId",
        ".write": "auth != null && auth.uid == $userId"
      }
    }
  }
}
```

## Implementation Notes

### Performance Optimizations
1. **Indexed Queries**: Use Firebase indexing for frequently queried fields
2. **Pagination**: Implement pagination for large topic lists
3. **Selective Loading**: Load replies on-demand rather than with topics
4. **Caching**: Implement client-side caching for better performance

### Data Integrity
1. **Atomic Updates**: Use Firebase batch updates for related data changes
2. **Validation**: Implement client and server-side validation
3. **Cleanup**: Regular cleanup of orphaned data
4. **Backup**: Regular database backups for data recovery

### Monitoring
1. **Usage Analytics**: Track forum engagement metrics
2. **Error Logging**: Monitor and log database errors
3. **Performance Metrics**: Track query performance and optimization opportunities
4. **Report Analytics**: Monitor reporting patterns for moderation insights

## Migration Notes

If migrating from an existing forum system:
1. Export existing data in the new schema format
2. Update security rules before data migration
3. Test all functionality in a staging environment
4. Plan for minimal downtime during migration
5. Implement data validation scripts post-migration

This schema supports a robust forum system with social features and content moderation capabilities while maintaining real-time performance and data integrity.