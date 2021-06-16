import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import User from "../user/user.entity";
import Tag from "../tag/tag.entity";

@Entity()
export default class Post {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({nullable: false})
  public title: string;

  @Column({nullable: false, default: '', length: 50})
  public description: string;

  @Column({nullable: false})
  public content: string;

  @Column({type: "timestamptz", nullable: false, default: () => 'CURRENT_TIMESTAMP'})
  public publicationDate: Date;

  @ManyToOne(() => User, (author: User) => author.posts)
  public author: User;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];
}
