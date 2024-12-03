import React, { useState } from 'react';
import { Form, Segment, Radio, Header, Button, TextArea, Input, Message } from 'semantic-ui-react';
import { storage, db } from '../firebase'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import NavBar from './NavBar'; 
import './PostPage.css'; 

const useFormState = (initialState) => {
  const [state, setState] = useState(initialState);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };
  return [state, handleChange];
};

const PostPage = () => {
  const [postType, setPostType] = useState('article');
  const [article, handleArticleChange] = useFormState({
    title: '',
    abstract: '',
    content: '',
    tags: '',
    image: null,
  });
  const [question, handleQuestionChange] = useFormState({
    title: '',
    description: '',
    tags: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [message, setMessage] = useState(''); 

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      handleArticleChange({
        target: {
          name: 'image',
          value: e.target.files[0],
        },
      });
    }
  };

  const uploadImage = async (file) => {
    const imageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let uploadedImageUrl = '';

    try {
      if (postType === 'article' && article.image) {
        uploadedImageUrl = await uploadImage(article.image);
      }

      const postData = postType === 'article'
        ? { 
            title: article.title,
            abstract: article.abstract,
            content: article.content,
            tags: article.tags,
            imageUrl: uploadedImageUrl,
            createdAt: new Date() 
          }
        : { 
            title: question.title, 
            description: question.description, 
            tags: question.tags, 
            createdAt: new Date() 
          };

      await addDoc(collection(db, 'posts'), postData);
      setMessage(`Your ${postType} has been successfully posted!`);
      setIsSubmitted(true);

      // Reset forms after submission
      if (postType === 'article') {
        handleArticleChange({
          target: {
            name: 'reset',
            value: {
              title: '',
              abstract: '',
              content: '',
              tags: '',
              image: null,
            },
          },
        });
      } else {
        handleQuestionChange({
          target: {
            name: 'reset',
            value: {
              title: '',
              description: '',
              tags: '',
            },
          },
        });
      }
    } catch (error) {
      console.error('Error during post submission:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Segment className="post-page">
      <NavBar />
      {isSubmitted ? (
        <Segment>
          <Message positive>
            <Message.Header>{message}</Message.Header>
          </Message>
          <Button as={Link} to="/" primary>
            Go to Home
          </Button>
          <Button primary onClick={() => setIsSubmitted(false)}>
            Post Another {postType === 'article' ? 'Article' : 'Question'}
          </Button>
        </Segment>
      ) : (
        <Segment>
          <Header as="h2" className="header-title">New Post</Header>
          <Form onSubmit={handleSubmit} loading={loading}>
            <Form.Field className="post-type-selection">
              <label className="label-title">Select Post Type:</label>
              <Radio
                label='Question'
                name='postType'
                value='question'
                checked={postType === 'question'}
                onChange={(e, { value }) => setPostType(value)}
              />
              <Radio
                label='Article'
                name='postType'
                value='article'
                checked={postType === 'article'}
                onChange={(e, { value }) => setPostType(value)}
              />
            </Form.Field>

            {/* Article Form */}
            {postType === 'article' && (
              <Segment className="form-segment">
                <Header as="h3" className="form-header">Post an Article</Header>
                <Form.Field>
                  <label>Title</label>
                  <Input
                    placeholder='Enter a descriptive title'
                    name="title"
                    value={article.title}
                    onChange={handleArticleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Abstract</label>
                  <TextArea
                    placeholder='Enter a 1-paragraph abstract'
                    name="abstract"
                    value={article.abstract}
                    onChange={handleArticleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Content</label>
                  <TextArea
                    placeholder='Enter the content of your article'
                    name="content"
                    value={article.content}
                    onChange={handleArticleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Tags</label>
                  <Input
                    placeholder='Please add up to 3 tags'
                    name="tags"
                    value={article.tags}
                    onChange={handleArticleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Add an Image</label>
                  <Input type="file" accept="image/*" onChange={handleImageChange} />
                </Form.Field>
                <Button primary type='submit' disabled={loading}>Post Article</Button>
              </Segment> )}
            {/* Question Form */}
            {postType === 'question' && (
              <Segment className="form-segment">
                <Header as="h3" className="form-header">Post a Question</Header>
                <Form.Field>
                  <label>Title</label>
                  <Input
                    placeholder='Start your question with how, what, why, etc.'
                    name="title"
                    value={question.title}
                    onChange={handleQuestionChange}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Describe your problem</label>
                  <TextArea
                    placeholder='Describe your problem'
                    name="description"
                    value={question.description}
                    onChange={handleQuestionChange}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Tags</label>
                  <Input
                    placeholder='Please add up to 3 tags'
                    name="tags"
                    value={question.tags}
                    onChange={handleQuestionChange}
                  />
                </Form.Field>
                <Button primary type='submit' disabled={loading}>Post Question</Button>
              </Segment>
            )}
          </Form>
        </Segment>
      )}
    </Segment>
  );
};
export default PostPage;